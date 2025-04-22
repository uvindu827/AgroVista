import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


function UpdateNFPost() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: null,
        keywords: [],
    });

    useEffect(() => {
        const fetchHandler = async() => {
            try {
                const res = await axios.get(`http://localhost:3000/api/newsFeed/${id}/getPostById`);
                setFormData(res.data.data);

            } catch (error) {
                console.error("Error fetching post data:", error);
            }
        };
        fetchHandler();
    }, [id]);

    const sendRequest = async () => {
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('image', formData.image);
            formData.keywords.forEach((keyword, index) => {
                formDataToSend.append(`keywords[${index}]`, keyword);
            });
    
            await axios.put(
                `http://localhost:3000/api/newsFeed/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            navigate("/nf-management");
        } catch (error) {
            console.error("Error updating post:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest();
    };

    const handleCancel = () => {
        navigate("/nf-management");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
      
        if (name === "keywords") {
          const keywordArray = value.split(",").map(k => k.trim());
          setFormData({
            ...formData,
            keywords: keywordArray,
          });
        } else {
          setFormData({
            ...formData,
            [name]: value,
          });
        }
      };
      

  return (
    <div className="min-h-screen bg-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-green-300 py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Update Post
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="mt-1">
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <div className="mt-1">
                <textarea
                  id="content"
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image
              </label>
              <div className="mt-1">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="keywords"
                className="block text-sm font-medium text-gray-700"
              >
                Keywords (comma-separated)
              </label>
              <div className="mt-1">
                <input
                  id="keywords"
                  name="keywords"
                  type="text"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-inline justify-between">
            <button
                type="button"
                onClick = {handleCancel}
                className="px-6 py-2 mr-10 border bg-yellow-400 border-yellow-400 text-black rounded-lg hover:bg-yellow-200"
                >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greeen-500 disabled:bg-green-300"
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateNFPost
