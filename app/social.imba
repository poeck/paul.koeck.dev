tag social 
	prop image 
	prop link 

	css .icon
		o:0.25 @hover:0.4
		size:1.7rem
		cursor: pointer

	<self>
		<img.icon @click=(window.open(link)) src=image>