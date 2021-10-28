import "./email.imba"
import "./social.imba"
import { timeline, animate } from "motion"

# Assets
import wave from "../images/wave.png"
import codepenIcon from "../images/codepen.svg"
import fiverrIcon from "../images/fiverr.svg"
import githubIcon from "../images/github.svg"
import linkedinIcon from "../images/linkedin.svg"

global css html
	# Set defaults
	* m:0 p:0 box-sizing:border-box
	# Set font
	ff:"Inter", sans-seif

tag app
	css .animate
		o:0
		transform: translateY(100%)

	css .animate-icon
		o:0
		transform: translateY(200%)


	def mount
		animate($hand, { transform: ["rotate(25deg)", "rotate(0deg)", "rotate(25deg)"]}, {offset: [0, 0.75, 1], duration: 1, repeat: Infinity})

		timeline([
			[$hand, { opacity: 0}],
			[$title, { opacity: 1, transform: "translateY(0)" }],
			[$subtitle, { opacity: 1, transform: "translateY(0)" }, {at: "-0.1"}],
			[$email, { opacity: 1, transform: "translateY(0)" }, {at: "-0.1"}],
		], {duration: 1.5, delay: 2})

		timeline([
			[$fiverr, { opacity: 1, transform: "translateY(0)" }],
			[$linkedin, { opacity: 1, transform: "translateY(0)" }, {at: "-0.2"}],
			[$github, { opacity: 1, transform: "translateY(0)" }, {at: "-0.2"}],
			[$codepen, { opacity: 1, transform: "translateY(0)" }, {at: "-0.2"}],
		], {duration: 0.6, delay: 3.5})

	<self>
		<main [pos:relative w:100% h:100vh d:flex jc:center ai:center fld:column]>
			<img$hand [pos:absolute h:5rem mb:1rem] src=wave>
			<h1$title .animate [fs:3.5em @sm:6em]> "I'm Paul" 
			<h2$subtitle .animate [fs:1.2em @sm:1.8em fw:400 c:indigo5]> "Web & App Developer"
			<email$email .animate [mt:2rem @sm:3rem]>
			<div [pos:absolute b:3rem d:flex jc:center ai:center fld:row g:1.2rem]>
				<social$fiverr .animate-icon image=fiverrIcon link="https://fiverr.com/paulkoeck">	
				<social$linkedin .animate-icon image=linkedinIcon link="https://www.linkedin.com/in/paul-k%C3%B6ck-1221a3219/">	
				<social$github .animate-icon image=githubIcon link="https://github.com/poeck">	
				<social$codepen .animate-icon image=codepenIcon link="https://codepen.io/paulkoeck">	
		<footer [w:100% py:2rem bg:gray2 d:flex jc:center ai:center fld:column gap:0.2rem]>
			<p [c:gray6 fs:1em]> `© {new Date().getFullYear!} Paul Koeck`
			

imba.mount <app>