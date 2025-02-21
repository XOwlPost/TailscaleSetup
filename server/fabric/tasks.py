from fabric import task
import requests
import json
import subprocess

def run_command(command):
    """Execute a shell command and return its output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    return result.stdout.strip()

@task
def setup_node(c, auth_key, tags=None):
    """Setup a new node with Tailscale and Agent0"""
    # Install dependencies
    c.run("apt-get update && apt-get install -y curl python3 python3-pip")

    # Install Tailscale
    c.run("curl -fsSL https://tailscale.com/install.sh | sh")

    # Join Tailscale network
    join_cmd = f"tailscale up --authkey={auth_key}"
    if tags:
        join_cmd += f" --advertise-tags={tags}"
    c.run(join_cmd)

    # Install and configure Agent0
    c.run("pip3 install agent0")
    c.put("../agent0/config.yml", "/etc/agent0/config.yml")
    c.run("systemctl restart agent0")

@task
def check_status(c):
    """Check node status with enhanced monitoring"""
    status = {
        "tailscale": run_command("tailscale status --json"),
        "system": {
            "cpu": run_command("top -bn1 | grep 'Cpu' | awk '{print $2}'"),
            "memory": run_command("free | grep Mem | awk '{print $3/$2 * 100.0}'"),
            "packet_loss": run_command("ping -c 5 1.1.1.1 | grep 'packet loss' | cut -d',' -f3 | cut -d'%' -f1"),
        },
        "services": {
            "ssh": run_command("systemctl is-active ssh"),
            "dns": run_command("systemctl is-active systemd-resolved"),
            "network": run_command("systemctl is-active networking"),
        }
    }
    return json.dumps(status)

@task
def update_acls(c, rules_file):
    """Update Tailscale ACLs"""
    with open(rules_file) as f:
        rules = json.load(f)
    c.run(f"tailscale set --acls={json.dumps(rules)}")

@task
def self_heal(c):
    """Perform self-healing operations based on status checks"""
    status = json.loads(check_status(c))

    # Check and heal SSH
    if status["services"]["ssh"] != "active":
        c.run("systemctl restart ssh")

    # Check and heal DNS
    if status["services"]["dns"] != "active":
        c.run("systemctl restart systemd-resolved")

    # Check and heal networking
    if float(status["system"]["packet_loss"]) > 20:
        c.run("systemctl restart networking")

    # Check and heal Tailscale
    if "offline" in status["tailscale"]:
        c.run("tailscale up --reset")

@task
def optimize_exit_node(c):
    """Optimize exit node selection based on latency"""
    c.run("tailscale set --exit-node=auto")