const { isLoading, error, sendRequest, clearError } = useHttpClient();
const solutionSubmitHandler = async (optimizer, optimizedSolution, optimizedPopulation, pointData) => {
    event.preventDefault();
    try {
        const formData = new FormData();
        formData.append('optimizer', optimizer);
        formData.append('optimizedSolution', optimizedSolution);
        formData.append('optimizedPopulation', optimizedPopulation);
        formData.append('points', pointData);
        await sendRequest(process.env.REACT_APP_BACKEND_URL+'/solutions', 'POST', formData);
    } catch (err) {}
};
export default solutionsSubmitHandler;