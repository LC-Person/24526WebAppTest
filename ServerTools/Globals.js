const {NavButton, ProjectCard, WideCard} = require('./utils.js');


class GlobalContent {
    constructor(){
        this.NavStack = []
        this.ProjectCards = [];
        //Need to find a better solution for this its a place holder
        this.wideCards = {};

        this.populate();
    }

    populate(){   
        // Populate the Navlinks
        this.NavStack.push(new NavButton("/Home","Home"));
        this.NavStack.push(new NavButton("/AboutMe","About Me"));
        this.NavStack.push(new NavButton("/Blog","Blog Area"));
        //Populate Current projects
        this.ProjectCards.push(new ProjectCard('Project1',
         'epic description1',
         '/Public/images/last.png',
         'alt-text',
         '/blog')
        );
        this.ProjectCards.push(new ProjectCard('Project2', 
         'epic description2', 
         '/Public/images/last.png', 
         'alt-text', 
         '/home')
        );

        this.wideCards['30s'] = new WideCard(
            '/Public/images/yeet.png',
            'profilePic',
            '30 second Introduction:',
            'Hello Internet and whom it may concern, My name Is Luis Contreras and I am a senior, soon to be graduate from The university of kentucky with a bachelor\'s in Computer Science, I enjoy programming because i enjoy solving problems that no one has.',
        );
        this.wideCards['Capable'] = new WideCard(
            '',
            '',
            'Cool stuff I can do:',
            'Hello Internet and whom it may concern, My name Is Luis Contreras and I am a senior, soon to be graduate from The university of kentucky with a bachelor\'s in Computer Science, I enjoy programming because i enjoy solving problems that no one has.',
        );
    }
}

module.exports =  {GlobalContent};