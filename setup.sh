#!/bin/bash

if [[ $1 == "" ]]; then
    echo "[ERROR] You need to pass os architecture as a parameter. For 64-bit type: bash setup.sh 64"
    exit 1
fi

if [[ $1 == "32" ]]; then
    arch=i386
elif [[ $1 == "64" ]]; then
    arch=amd64
fi

mkdir osrm
cd osrm

echo "Setting up OSRM. This might take a long time..."
sudo apt-get install -y docker.io
wget http://download.geofabrik.de/north-america/us/louisiana-latest.osm.pbf
sudo docker run -t -v $(pwd):/data osrm/osrm-backend:latest osrm-extract -p /opt/car.lua /data/louisiana-latest.osm.pbf
sudo docker run -t -v $(pwd):/data osrm/osrm-backend:latest osrm-contract /data/louisiana-latest.osrm

echo "Downloading sencha cmd, after which installation will start"
sudo apt-get install -y openjdk-11-jre
wget http://cdn.sencha.com/cmd/7.2.0.84/no-jre/SenchaCmd-7.2.0.84-linux-$arch.sh.zip
unzip SenchaCmd-7.2.0.84-linux-$arch.sh.zip
rm SenchaCmd-7.2.0.84-linux-$arch.sh.zip
bash SenchaCmd-7.2.0.84-linux-$arch.sh
