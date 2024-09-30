# Need ubuntu for dynamic linking
FROM ubuntu:22.04 AS run

# Copy the build output from the GitHub Workflow
COPY telemetry_proxy /bin/telemetry_proxy

RUN ["chmod", "+x", "/bin/telemetry_proxy"]

# Run the binary
ENTRYPOINT [ "/bin/telemetry_proxy" ]
