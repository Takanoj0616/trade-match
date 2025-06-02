#!/bin/bash

# Configuration
ACTIVATIONURL='dsm://agents.deepsecurity.trendmicro.com:443/'
MANAGERURL='https://app.deepsecurity.trendmicro.com:443'
CURLOPTIONS='--silent --tlsv1.2'

# Load configuration from environment variables or config file
TENANT_ID=${TENANT_ID:-"47E95A69-90E9-D9F0-003E-5A06D4964008"}
ACTIVATION_TOKEN=${ACTIVATION_TOKEN:-"EF6FE1EE-B1C6-FEB3-70D3-DEFAA1FF2394"}
POLICY_ID=${POLICY_ID:-"68"}

# Initialize variables
linuxPlatform=''
isRPM=''

# Cleanup function
cleanup() {
    rm -f /tmp/PlatformDetection
    rm -f /tmp/agent.rpm /tmp/agent.deb
}

# Error handling
set -e
trap cleanup EXIT

# Check root privileges
if [[ $(/usr/bin/id -u) -ne 0 ]]; then
    echo "Error: This script must be run as root"
    logger -t "Error: This script must be run as root"
    exit 1
fi

# Check for curl
if ! type curl >/dev/null 2>&1; then
    echo "Error: curl is required but not installed"
    logger -t "Error: curl is required but not installed"
    exit 1
fi

# Download platform detection script
echo "Downloading platform detection script..."
if ! curl -L "$MANAGERURL/software/deploymentscript/platform/linuxdetectscriptv1/" -o /tmp/PlatformDetection $CURLOPTIONS; then
    echo "Error: Failed to download platform detection script"
    logger -t "Error: Failed to download platform detection script"
    exit 1
fi

# Source platform detection script
if [ -s /tmp/PlatformDetection ]; then
    . /tmp/PlatformDetection
else
    echo "Error: Platform detection script is empty"
    logger -t "Error: Platform detection script is empty"
    exit 1
fi

# Detect platform
platform_detect
if [[ -z "${linuxPlatform}" ]] || [[ -z "${isRPM}" ]]; then
    echo "Error: Unsupported platform detected"
    logger -t "Error: Unsupported platform detected"
    exit 1
fi

# Check for required packages on SuSE
if [[ ${linuxPlatform} == *"SuSE_15"* ]]; then
    if ! type pidof &> /dev/null || ! type start_daemon &> /dev/null || ! type killproc &> /dev/null; then
        echo "Error: sysvinit-tools is required but not installed"
        logger -t "Error: sysvinit-tools is required but not installed"
        exit 1
    fi
fi

# Determine package type
if [[ $isRPM == 1 ]]; then
    package='agent.rpm'
else
    package='agent.deb'
fi

# Download agent package
echo "Downloading agent package..."
if ! curl -H "Agent-Version-Control: on" -L "$MANAGERURL/software/agent/${runningPlatform}${majorVersion}/${archType}/$package?tenantID=$TENANT_ID" -o "/tmp/$package" $CURLOPTIONS; then
    echo "Error: Failed to download agent package"
    logger -t "Error: Failed to download agent package"
    exit 1
fi

# Install agent package
echo "Installing agent package..."
if [[ $isRPM == 1 && -s /tmp/agent.rpm ]]; then
    rpm -ihv /tmp/agent.rpm
elif [[ -s /tmp/agent.deb ]]; then
    dpkg -i /tmp/agent.deb
else
    echo "Error: Agent package download failed"
    logger -t "Error: Agent package download failed"
    exit 1
fi

echo "Agent package installed successfully"

# Wait for service to start
sleep 15

# Activate agent
echo "Activating agent..."
/opt/ds_agent/dsa_control -r
/opt/ds_agent/dsa_control -a "$ACTIVATIONURL" "tenantID:$TENANT_ID" "token:$ACTIVATION_TOKEN" "policyid:$POLICY_ID"

echo "Installation completed successfully" 