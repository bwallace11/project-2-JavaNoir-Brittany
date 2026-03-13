# Project 2 Student Hub: Lost in the Scroll


 **Project title**
# Java Noir
 
- **Optional:** 
https://drive.google.com/file/d/1cPi1J--zuOemiNcWPygiLaEFE_ybGQOy/view?usp=sharing


- **Description:** 
This project is an interactive scrollytelling website called JavaNoir. The goal of the site is to teach JavaScript concepts through a detective noir story where the user plays the role of a detective investigating a case. Instead of presenting programming concepts as dry technical explanations, the site turns them into pieces of a narrative. As the user scrolls through the page, different parts of the story unfold and different JavaScript ideas are introduced as if they were clues in the investigation. The site mixes storytelling, animation, and code concepts so that learning feels more like exploring a mystery than reading a tutorial.

The overall structure of the site is built around the idea of scrollytelling, which means the story progresses as the user scrolls down the page. Each section represents a different moment in the investigation. As the reader moves through the page, visual elements animate, clues appear, and the narrative advances. This technique works especially well for educational storytelling because it breaks information into small steps and lets the reader control the pace. Scroll-based storytelling is commonly powered by animation libraries that connect the scroll position of the page to animations or events. In this project, the main library used to handle that behavior is GSAP with the ScrollTrigger plugin. ScrollTrigger allows animations or interactions to start when specific elements reach certain points in the viewport and can also link the progress of animations directly to scroll movement.

The main files of the project are organized around HTML structure, CSS styling, and JavaScript interactions. The HTML file acts as the backbone of the entire site. It contains the different story sections, layout containers, and content elements such as evidence items, clue descriptions, and narrative text. Each section is structured in a way that makes it easy for the animations and scroll triggers to target specific elements. For example, certain elements act as triggers for animations when they enter the viewport. The HTML also organizes the story chapters so the site feels like a continuous narrative rather than separate pages.

The CSS files control the overall visual style of the site and help establish the noir theme. The design uses dark backgrounds, high contrast text, and dramatic lighting elements to capture the feeling of a classic detective story. The styling also includes layout systems that keep the sections readable while still allowing animations to move elements around the screen. Some styles are used purely for atmosphere, such as shadows, textures, and subtle motion effects that make the page feel more cinematic. The CSS also includes design tokens and theme rules so that visual elements stay consistent across the site.

The JavaScript files are where most of the interactive behavior lives. JavaScript is responsible for controlling the scroll animations, triggering story events, and managing the interactive elements that represent clues or evidence. GSAP is used to create animation timelines and motion effects, while ScrollTrigger connects those animations to the user’s scroll position. Instead of animations simply playing automatically, the scroll position becomes the controller. In other words, the scrollbar acts like a timeline that moves the story forward or backward depending on how the user scrolls. This technique is commonly used in scrollytelling experiences because it allows animations to stay synchronized with the reader’s progress through the page.

Another important part of the JavaScript logic is the way the site handles interactive elements like clues or evidence. When the user discovers something in the story, the interface updates to show new information. This makes the page feel more like an investigation rather than a static webpage. Some features also store progress so that evidence or discoveries remain visible as the user continues through the site.

Several design choices were made intentionally to support the storytelling concept. One of the biggest choices was using a detective noir theme. Noir works well for this type of project because the genre already revolves around investigation, hidden information, and piecing together clues. That idea maps nicely onto learning programming concepts, where you often have to explore, test ideas, and gradually uncover how things work. The dark aesthetic also helps highlight animations and interactive elements because motion stands out more clearly against a darker background.

Another key design decision was breaking the story into smaller sections instead of long blocks of text. Each section introduces a concept or moment in the investigation so the user never feels overwhelmed with information. The animations between sections help transition from one idea to the next, which keeps the pacing engaging and prevents the page from feeling like a static article.

Finally, the project focuses on combining education with narrative design. Instead of teaching JavaScript concepts through traditional documentation or examples, the site frames them as tools used by the detective. Variables, memory storage, and other programming ideas become part of the story world. This approach makes the material more memorable because the reader associates the technical concepts with events in the narrative.

Overall, the JavaNoir project is designed to show how storytelling, animation, and programming concepts can work together. By using scroll-based interaction, themed visuals, and structured sections, the site turns a technical topic into an interactive experience that feels more like exploring a mystery than studying code.


- **Links:** [[JavaNoir](https://scrollytelling-javanoir-bwallace.netlify.app/)]


- **Tech stack:** 


Frontend

HTML5

CSS3

Vanilla JavaScript

Animation & Interaction

GSAP

GSAP ScrollTrigger

GSAP ScrollSmoother

Storage

Browser localStorage

Development & Deployment

GitHub

Netlify


- **Reflection**
Metaphor Summary

The main metaphor of this project is that learning JavaScript is like solving a detective case. Instead of presenting programming ideas as dry technical lessons, the website turns them into pieces of a mystery. The user becomes the detective, and each concept is treated like a clue that helps uncover the truth behind the case. As the reader scrolls through the page, the investigation moves forward and different JavaScript ideas are revealed as part of the story. For example, concepts like memory or stored data are explained like a detective’s case file that keeps track of evidence over time. This metaphor helped make technical ideas easier to understand because they were tied to a narrative. Noir stories already revolve around investigation, evidence, and slowly uncovering information, so it felt like a natural way to explain how programming works.

Section I’m Most Proud Of

The section I’m most proud of is the dark room scene. In that part of the story, the lighting, animation, and pacing all work together to create a strong atmosphere. It feels like a moment where the investigation pauses and something important is revealed. The darker visuals and focused layout make it stand out from the rest of the site. I like this section because it feels the most cinematic and really leans into the noir theme of the project. It also shows how animation and storytelling can work together instead of just being decorative. The mood of that scene helps pull the user deeper into the story and makes the experience feel more immersive.

Technical Bug I Solved

One technical issue I ran into involved scroll animations triggering at the wrong time. Some animations would start before the section was fully visible on the screen, which made the story feel out of sync with the scrolling. This happened because the ScrollTrigger start and end positions were not aligned correctly with the sections. I fixed the problem by adjusting the trigger settings and testing the timing while scrolling slowly through the page. After updating the trigger positions, the animations started at the correct moment and the flow of the story felt much smoother.

Accessibility Decision

One accessibility decision I made was supporting reduced motion. Since the site uses a lot of scroll animations and transitions, that kind of movement can be uncomfortable for some users. I added a system that checks the user’s reduced motion preference and disables extra animation effects when that setting is enabled. This means the content still appears and the story still works, but without the heavy motion. It keeps the experience accessible while still allowing the full animation experience for users who want it.

What I Would Improve With More Time

If I had more time, I would focus on improving the pacing and interaction of the story. Some sections could include more interactive elements so the user feels even more involved in the investigation. I would also spend more time polishing the transitions between sections so the narrative flows more smoothly from one moment to the next. Another improvement would be adding more small visual details that strengthen the noir atmosphere. The project already works as a complete interactive story, but with more time I think the immersion and storytelling could be pushed even further.
