https://www.youtube.com/watch?v=kAM-_vZIYkI

#### Networking driver

Bridge, Host, Overlay, Macvlan, none, plugins

#### Minimize image size:

- use Alpine-based image
- .dockerignore
- use multy-stage build
- avoid unnessessary layers

#### Installation for Windows

Docker Desktop + docker-cli + vscode extention Docker<br>
https://docs.docker.com/desktop/setup/install/windows-install/

1. https://learn.microsoft.com/en-us/windows/wsl/install
   `wsl --install`
   https://learn.microsoft.com/en-us/windows/wsl/install-manual
   `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`
   `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`

-

#### Security

Company ?Snic? integrates with Docker<br>
`> docker scan`

#### Push build images to repository on `Docker Hub`

Some number of images can be pushed as one image `> docker-compose push`

#### CLI

`docker system prune -a` - clear all unused
`docker images` - list present images
`docker pull` - get image from repo
`docker run -i -t <image-name> <command-to-run>` - runs a command in a new container, pulling the image if needed and starting the container
`docker ps -a` - Show all containers (default shows just running)
`docker container start <cont-name>`
`docker container stop <cont-name>`
`docker container rm <cont-name>`
`docker container inspect <cont-name>` - Display detailed information on one or more containers
`docker rmi <image-name>` - Remove image
`docker build . ` - Build an image from a Dockerfile
