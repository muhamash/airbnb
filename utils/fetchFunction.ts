export async function fetchDictionary(locale) {
  try {
    const response = await fetch(`http://localhost:3000/api/language?locale=${locale}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (data?.success) {
      return data?.data;
    } else {
      console.error("Failed to fetch dictionary", data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching dictionary", error);
    throw error;
  }
}