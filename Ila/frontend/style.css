function showDate() {

    const date = new Date();

    document.getElementById("today").innerText =
        date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


function loadFoodRecords() {

    fetch("http://127.0.0.1:5000/food/1")

        .then(response => {

            if (!response.ok) {
                throw new Error("Food records could not be loaded");
            }

            return response.json();

        })

        .then(records => {

            if (records.length === 0) {

                document.getElementById("prepared").innerText = "0";
                document.getElementById("sold").innerText = "0";
                document.getElementById("remaining").innerText = "0";
                document.getElementById("foodReview").innerText = "0";

                document.getElementById("averageDemand").innerText = "--";

                document.getElementById("demandText").innerText =
                    "No food records yet. Add records to understand your usual demand.";

                return;
            }


            const latest = records[0];

            const prepared =
                Number(latest.food_prepared);

            const sold =
                Number(latest.food_sold);

            const remaining =
                Number(latest.food_remaining);


            document.getElementById("prepared").innerText =
                prepared;

            document.getElementById("sold").innerText =
                sold;

            document.getElementById("remaining").innerText =
                remaining;

            document.getElementById("foodReview").innerText =
                remaining;


            loadAverageDemand(records.length);

        })

        .catch(error => {

            console.log(error);

            document.getElementById("demandText").innerText =
                "Food records could not be loaded from the server.";

        });
}



function loadAverageDemand(recordCount) {

    fetch("http://127.0.0.1:5000/food/average/1")

        .then(response => {

            if (!response.ok) {
                throw new Error("Average demand could not be loaded");
            }

            return response.json();

        })

        .then(data => {

            if (data.average_sold === null) {

                document.getElementById("averageDemand").innerText =
                    "--";

                return;
            }


            document.getElementById("averageDemand").innerText =
                data.average_sold;


            if (recordCount === 1) {

                document.getElementById("demandText").innerText =
                    "Based on one recorded day. Add more records for a clearer view of usual demand.";

            } else {

                document.getElementById("demandText").innerText =
                    "Based on the average meals sold across " +
                    recordCount +
                    " recorded days.";

            }

        })

        .catch(error => {

            console.log(error);

            document.getElementById("averageDemand").innerText =
                "--";

        });
}



function getProduceImage(produceType) {

    const type =
        String(produceType || "").toLowerCase();


    if (type.includes("ginger")) {

        return "https://images.unsplash.com/photo-1741517802684-ba07c444a5d2?auto=format&fit=crop&w=600&q=80";
    }


    if (type.includes("potato")) {

        return "https://images.unsplash.com/photo-1774351922689-896a9340aa7b?auto=format&fit=crop&w=600&q=80";
    }


    if (type.includes("turmeric")) {

        return "https://images.unsplash.com/photo-1768729341217-0e11cb959252?auto=format&fit=crop&w=600&q=80";
    }


    if (
        type.includes("leafy") ||
        type.includes("vegetable")
    ) {

        return "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80";
    }


    return "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80";
}



function loadProduce() {

    fetch("http://127.0.0.1:5000/produce")

        .then(response => {

            if (!response.ok) {
                throw new Error("Produce could not be loaded");
            }

            return response.json();

        })

        .then(produce => {

            const list =
                document.getElementById("produceList");


            list.innerHTML = "";


            if (produce.length === 0) {

                list.innerHTML = `
                    <div class="empty">
                        No local produce listings available yet.
                    </div>
                `;

                return;
            }


            produce.slice(0, 3).forEach(item => {

                const card =
                    document.createElement("div");


                card.className =
                    "produce-item";


                const image =
                    getProduceImage(item.produce_type);


                card.innerHTML = `

                    <img
                        src="${image}"
                        alt="${item.produce_type}"
                    >

                    <div class="produce-details">

                        <strong>
                            ${item.produce_type}
                        </strong>

                        <p>
                            ${item.quantity} kg
                        </p>

                        <p>
                            ${item.supplier || "Local supplier"}
                        </p>

                        <span class="produce-status">
                            ${item.availability || "Available"}
                        </span>

                    </div>

                `;


                list.appendChild(card);

            });

        })

        .catch(error => {

            console.log(error);

            document.getElementById("produceList").innerHTML = `

                <div class="empty">
                    Local produce information is unavailable.
                </div>

            `;

        });
}



function showMessage(section) {

    const toast =
        document.getElementById("toast");


    toast.innerText =
        section + " section";


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 1500);
}



document.addEventListener("DOMContentLoaded", () => {

    showDate();

    loadFoodRecords();

    loadProduce();

});
