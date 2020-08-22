#!/usr/bin/env bash

pm2 start npm --name="map-sign" -- run prod --watch --name=map-sign
