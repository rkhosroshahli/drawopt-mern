const { isLoading, error, sendRequest, clearError } = useHttpClient();
const pointSubmitHandler = async (optimizer, optimizedSolution, optimizedPopulation) => {
    event.preventDefault();
    try {
        const formData = new FormData();
        formData.append('optimizer', optimizer);
        formData.append('optimizedSolution', optimizedSolution);
        formData.append('optimizedPopulation', optimizedPopulation);
        await sendRequest(process.env.REACT_APP_BACKEND_URL+'/points', 'POST', formData);
    } catch (err) {}
};
export default pointSubmitHandler;