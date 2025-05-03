const usePrint = () => {

    const print = async () => {
        try {
            const response = await fetch('/bank/printFile');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }catch (error) {
            console.log(error)
        }
    }

    return {print};
}
export  default usePrint;