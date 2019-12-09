build:
	- sudo docker build . -t w40k_dice
run:
	- sudo docker run --name w40k_dice -p 8080:80/tcp w40k_dice
clean:
	- sudo docker kill w40k_dice
	- sudo docker container rm w40k_dice