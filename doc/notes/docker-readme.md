https://www.youtube.com/watch?v=kAM-_vZIYkI
https://www.youtube.com/watch?v=XPB0ZYNnFf0 [1:18:23]

#### Networking driver

Bridge, Host, Overlay, Macvlan, none, plugins

#### Minimize image size:

- use Alpine-based image
- .dockerignore
- use multy-stage build
- avoid unnessessary layers

#### Installation for Windows

Docker Desktop + docker-cli + vscode extention Docker<br>

1. Install WSL:<br>
   https://learn.microsoft.com/en-us/windows/wsl/install<br>
   `wsl --install`<br>
   OR<br>
   https://learn.microsoft.com/en-us/windows/wsl/install-manual<br>
   `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`<br>
   `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`<br>
   [WSL2 Linux kernel update package for x64 machines](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)<br>
   `wsl --set-default-version 2`<br>

2. [Install Docker](https://docs.docker.com/desktop/setup/install/windows-install/)
3. If your administrator account is different to your user account, you must add the user to the docker-users group:<br>

- Run Computer Management as an administrator.<br>
- Navigate to Local Users and Groups > Groups > docker-users.<br>
- Right-click to add the user to the group.<br>
- Sign out and sign back in for the changes to take effect.<br>

#### Push build images to repository on `Docker Hub`

Some number of images can be pushed as one image `> docker-compose push`

#### CLI

`docker system prune -a` - clear all unused<br>
`docker images` - list present images<br>
`docker pull` - get image from repo<br>
`docker run -i -t <image-name> <command-to-run>` - runs a command in a new container, pulling the image if needed and starting the container<br>
`docker ps -a` - Show all containers (default shows just running)<br>
`docker container start <cont-name>`<br>
`docker container stop <cont-name>`<br>
`docker container rm <cont-name>`<br>
`docker container inspect <cont-name>` - Display detailed information on one or more containers<br>
`docker rmi <image-name>` - Remove image<br>
`docker build . ` - Build an image from a Dockerfile<br>

#### Notes

- to autorestart use nodemon + use apropriate config in Dockerfile<br>
- volumes for logs & db-data can be set in Docker-compouse file<br>
- [vulnerability scanning](docs.docker.com/engine/scan)<br>
- [multistage build](docs.docker.com/develop-images/multistage-build)<br>
