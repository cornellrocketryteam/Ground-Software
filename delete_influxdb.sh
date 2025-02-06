#!/bin/sh

sudo docker compose exec influxdb influx delete --start 2009-01-02T23:00:00Z --stop 2026-01-02T23:00:00Z --bucket telemetry

