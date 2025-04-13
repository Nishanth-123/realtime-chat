export const saveRoomDetails = (details: any) => {
    if(details){
        localStorage.setItem("roomDetails", JSON.stringify(details));
    }else{
        localStorage.removeItem("roomDetails");
    }
}

export const getRoomDetails = () => {
    const details = localStorage.getItem("roomDetails")
    return details ? JSON.parse(details) : undefined;
}