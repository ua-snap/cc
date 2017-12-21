# cc: Climate Conditions data api

This initial-stage project is a data API to power apps that explore SNAP/IARC data.

The main goals are:

 * Provide an extensible API for accessing data for apps.
 * Decouple on-demand data processing from the API, so that we can use other languages which are betters suited for this (Python, etc).

## Development setup

Preconditions for running this are:

 * NodeJS >=8.5.0
 * Python >=3.6.3
 * pipenv >=9.0.1 (used for installing/managing the virtualenv)
 * RabbitMQ >=3.7.0
 * C++ compiler (build scripts invoke `g++` sometimes)

Installation will vary by platform.

### OSX High Sierra

Installation:

```bash
brew install rabbitmq
brew services start rabbitmq # will ensure service is running
git clone git@github.com:ua-snap/cc.git & cd cc
cd node && npm install
cd ../python && pipenv install --dev
```

### Fedora 26

```bash
sudo dnf install rabbitmq
sudo service start rabbitmq-server
git clone git@github.com:ua-snap/cc.git & cd cc
cd node && npm install
cd ../python && pipenv install --dev
```

## Running the platform

TODO: Would prefer to use `nodemon` for Node and something suitable for Python development too.

```
cd node && npm start
cd python && pipenv run python process_wrapper.py

# Try it!
wget -q -O - "http://localhost:3000/thresholds/temp?days_window=2&max_temperature=-15"
```
