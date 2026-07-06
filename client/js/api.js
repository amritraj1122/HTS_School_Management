const API = {
  async request(url, options = {}) {
    try {
      if (typeof showLoader === "function") {
        showLoader();
      }

      const response = await fetch(url, options);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);

      throw error;
    } finally {
      if (typeof hideLoader === "function") {
        hideLoader();
      }
    }
  },

  async get(url) {
    return this.request(url);
  },

  async post(url, data) {
    return this.request(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
  },

  async put(url, data) {
    return this.request(url, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
  },

  async delete(url) {
    return this.request(url, {
      method: "DELETE",
    });
  },
};
