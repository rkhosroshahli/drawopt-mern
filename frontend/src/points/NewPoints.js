const { isLoading, error, sendRequest, clearError } = useHttpClient();
const pointSubmitHandler = async pointData => {
    event.preventDefault();
    try {
        const formData = new FormData();
        formData.append('points', pointData);
        await sendRequest(process.env.REACT_APP_BACKEND_URL+'/points', 'POST', formData);
    } catch (err) {}
};
export default pointSubmitHandler;