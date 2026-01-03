const projects = [
    {
        title: "Project One",
        image: "" // example: "images/projects/project1.jpg"
    },
    {
        title: "Project Two",
        image: ""
    },
    {
        title: "Project Three",
        image: ""
    }
];

const projectGrid = document.getElementById("projectGrid");

projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    const imageDiv = document.createElement("div");
    imageDiv.className = "project-image";

    if (project.image) {
        imageDiv.style.backgroundImage = `url(${project.image})`;
        imageDiv.style.backgroundSize = "cover";
        imageDiv.style.backgroundPosition = "center";
    }

    const title = document.createElement("div");
    title.className = "project-title";
    title.innerText = project.title;

    card.appendChild(imageDiv);
    card.appendChild(title);
    projectGrid.appendChild(card);
});
