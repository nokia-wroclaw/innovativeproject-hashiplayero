import React from "react";

const Rules = () => {

    const rules = [
        {
            header: "On the board there are various islands... ",
            description: "They have some numbers written on them. Those numbers indicate how many bridges can be attached to them. You can build up to 2 bridges between same islands. " +
                "Bridges can't cross and they can't be build diagonally on the board.",
            image: "1" //Image with basic puzzle 
        },
        {
            header: "App informs you about correctness of your choice...",
            description: "If you hover over the island, it will show you all of the possible bridges that can be attached to it. " +
                "In order to connect islands just click on the first one and than click on the second one. Nodes that are currently picked will change color to yellow. " +
                "Those which are connected with correct amount of bridges will turn green. In case it's connected with to many bridges, it will turn red.",
            image: "2" //Image showing different colored islands
        },
        {
            header: "What if I make a mistake?",
            description: "Don't worry. In case you make any mistakes you can just delete all of the bridges between same islands. " +
                "For example, if you make 2 bridges to a island marked as 1, you can just try to add another bridge. Bridges between those islands will disappear " + 
                "and you will be able to start over.",
            image: "3"//Image showing process od deleting bridges
        },
        {
            header: "Ok... but when do I win? ",
            description: "If every island is connected with others in a correct way, you completed your puzzle.",
            image: "4"//Image showing completed puzzle
        }
    ]

    return (
        <>
            <h1>Rules</h1>
            {
                rules.map((r) => (
                    <div>
                        <h3>{r.header}</h3>
                        <p>{r.description}</p>
                        <img src={r.image} alt="Rule pic"></img>
                    </div>
                ))

            }
        </>
    );
}

export default Rules;