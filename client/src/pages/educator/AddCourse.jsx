import React, { useState, useContext } from 'react'
import { apiService } from '../../services/api.js'
import { AppContext } from '../../context/AppContext.jsx'
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

function AddCourse() {
    const { refreshCourses, refreshEducatorCourses } = useContext(AppContext);
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        thumbnail: null,
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'thumbnail') {
            setForm({ ...form, thumbnail: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData();
        const courseData = {
            courseTitle: form.title,
            courseDescription: form.description,
            coursePrice: Number(form.price),
            discount: 0,
            courseContent: [],
        };
        formData.append('courseData', JSON.stringify(courseData));
        formData.append('thumbnail', form.thumbnail);

        try {
            const data = await apiService.educator.addCourse(formData);
            if (data.success) {
                setSuccess(true);
                setForm({ title: '', description: '', price: '', thumbnail: null });
                refreshCourses();
                refreshEducatorCourses();
                setTimeout(() => setSuccess(false), 4000);
            } else {
                setError(data.message || 'Failed to add course');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-slate-900">Add New Course</h1>
                <p className="text-sm text-slate-500 mt-0.5">Fill in the details to publish a new course</p>
            </div>

            {/* Success banner */}
            {success && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm font-medium text-emerald-800">Course added successfully!</p>
                </div>
            )}

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Title</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                        placeholder="e.g. Introduction to React"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
                        placeholder="Describe what students will learn..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (USD)</label>
                    <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min={0}
                            className="w-full border border-slate-200 rounded-lg pl-8 pr-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                            placeholder="0 for free"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Thumbnail</label>
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                        {form.thumbnail ? (
                            <img
                                src={URL.createObjectURL(form.thumbnail)}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <Upload className="w-6 h-6" />
                                <span className="text-xs font-medium">Click to upload thumbnail</span>
                            </div>
                        )}
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>
                    {form.thumbnail && (
                        <p className="text-xs text-slate-400 mt-1.5">{form.thumbnail.name}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-medium text-sm rounded-lg py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                        </>
                    ) : (
                        'Publish Course'
                    )}
                </button>
            </form>
        </div>
    )
}

export default AddCourse
