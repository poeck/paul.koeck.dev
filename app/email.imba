tag email
	css 
		.btn-outline
			outline:none
			rd:0.5rem
			bs:solid
			bw:2
			bc:gray3 @hover:gray4 @focus:indigo5
			bg:none
			
			d:flex
			fld:row
			ai:center
	
			cursor:pointer
			tween:styles
			transition-duration: 0.15s
			of:hidden
				
		.btn-outline @hover .box
			bc: gray4

		.btn-outline @focus .box
			bc: indigo5 

		.btn-outline @focus .email
			c: indigo5 

		.btn-outline @focus .icon
			c: indigo5 
	
		.email
			c:gray6
			fs:1.2em
			px:1rem
			tween:styles
			transition-duration: 0.15s
	
		.box
			w:2.5rem @sm:3rem
			h:2.5rem @sm:3rem

			d:flex
			ai:center
			jc:center

			pos: relative
			bdr:2px solid gray3
			tween:styles
			transition-duration: 0.15s
			c:gray5
		
		.icon
			pos: absolute
			w:1.3rem	
			tween:styles
			transition-duration: 0.15s

		$check
			transform:translateY(-200%)	

	def copy
		window.navigator.clipboard.writeText("paul@koeck.dev");
		$check.style.transform = "translateY(0%)" 
		$clipboard.style.transform = "translateY(200%)" 
		setTimeout((do 
			reset($btn, $check, $clipboard)	
		), 2000)

	def reset button, check, clipboard
		button.blur()
		check.style.transform = "translateY(-200%)" 
		clipboard.style.transform = "translateY(0%)" 

	<self>
		<button$btn .btn-outline @click=(copy!)> 
			<div.box> 
				<svg$check .icon fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
				<svg$clipboard .icon fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
			<a.email> "paul@koeck.dev"	