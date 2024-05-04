import { Timestamp } from "firebase/firestore";

const convertTime = (timestamp:Timestamp) => {
    const milliseconds =
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;

    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);

    // Get the components of the date (day, month, year)
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        date
    );
    const year = date.getFullYear();

    // Format the date as "dd-month-yyyy"
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
};

export default convertTime;