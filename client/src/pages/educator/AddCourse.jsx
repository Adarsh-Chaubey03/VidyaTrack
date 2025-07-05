import React, { useState } from 'react'

function AddCourse() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        thumbnail: null,
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'thumbnail') {
            setForm({ ...form, thumbnail: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        // Here you would send form data to backend
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Add New Course</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-5">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Course Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Enter course title"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Enter course description"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Price (USD)</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Enter price"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Thumbnail</label>
                    <input
                        type="file"
                        name="thumbnail"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                    />
                    {form.thumbnail && (
                        <img
                            src={URL.createObjectURL(form.thumbnail)}
                            alt="Thumbnail Preview"
                            className="mt-2 w-32 h-20 object-cover rounded-lg border"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-emerald-500 text-white font-semibold rounded-lg py-2 mt-2 hover:bg-emerald-600 transition"
                >
                    Add Course
                </button>
                {success && (
                    <div className="text-green-600 font-semibold text-center mt-2">Course added successfully!</div>
                )}
            </form>
        </div>
    )
}

export default AddCourse
