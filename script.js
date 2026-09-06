function cell() {
    let value = "";

    const getValue = () => value; 
    const setValue = (playerMark) => {
        if(!value) {
            value = playerMark;
        }
    }

    return { getValue, setValue }
}