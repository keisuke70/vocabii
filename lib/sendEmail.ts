export const sendEmail = async () => {

    const response = await fetch(`/api/word-details?word=success`); 
    

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
};