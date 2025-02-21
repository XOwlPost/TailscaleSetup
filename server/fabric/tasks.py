from fabric import task
import requests
import json

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
    """Check node status"""
    return c.run("tailscale status --json", hide=True).stdout

@task
def update_acls(c, rules_file):
    """Update Tailscale ACLs"""
    with open(rules_file) as f:
        rules = json.load(f)
    c.run(f"tailscale set --acls={json.dumps(rules)}")
