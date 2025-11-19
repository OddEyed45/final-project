import { useEffect, useState } from "react";
import "../index.css";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
const fileUpload = async (file) => {
    const { data, error } = await supabase.storage
        .from('finalProject') // bucket name
        .upload(`public/${file.name}`, file, {
            cacheControl: '3600',
            upsert: false,
        })
    if (error) {
        console.error(error)
        return null
    }
    console.log(data)

    // Get the public URL
    const { data: urlData } = supabase.storage
        .from('finalProject')
        .getPublicUrl(`public/${file.name}`)

    return urlData.publicUrl
}

const Post = () => {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [post, setPost] = useState({ title: "", description: "" })
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0])
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = () => {
        setIsDragging(false);
    }


    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith('image/')) {
            setFile(droppedFile);
        }
    }

    useEffect(() => {
        const handleUpload = async () => {
            if (!file) return;

            setUploading(true);
            const fileUrl = await fileUpload(file);
            if (fileUrl) {
                setImageUrl(fileUrl);
            }
            setUploading(false);
        }
        handleUpload();
    }, [file]);


    const createPost = async (event) => {
        event.preventDefault()

        if (post.title.length == 0 || post.description.length == 0 || !imageUrl) {
            alert("Please fill all fields and wait for image upload to complete");
            return;
        }

        await supabase
            .from('posts')
            .insert({ title: post.title, description: post.description, image: imageUrl })
            .select()
        window.location = "/"
    }


    const handleChange = (event) => {
        const { name, value } = event.target
        setPost((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="main-page">
            <div className="post-container">
                <form className="padding-post-container" onSubmit={createPost}>
                    <div className="upload-section">
                        <label
                            htmlFor="file-upload"
                            className={`upload-area ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="upload-content">
                                {uploading ? (
                                    <p>Uploading...</p>
                                ) : file ? (
                                    <p>✓ {file.name}</p>
                                ) : (
                                    <>
                                        <span className="upload-icon">Upload Image</span>
                                        <p>Click to browse or drag and drop</p>
                                        <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="file-input"
                            accept="image/*"
                        />
                    </div>

                    <div style={{ height: "30px" }} />
                    <input
                        type="text"
                        name="title"
                        placeholder="Post Title"
                        value={post.title}
                        required={true}
                        onChange={handleChange}
                        className="title-input"
                    />

                    <div style={{ height: "30px" }} />
                    <input
                        type="text"
                        name="description"
                        placeholder="Post Description"
                        value={post.description}
                        required={true}
                        onChange={handleChange}
                        className="description-input"
                    />

                    <div style={{ height: "20px" }} />
                    <button className="dashboard-button" type="submit" disabled={uploading || !imageUrl}>
                        Post!
                    </button>
                </form>
            </div>
        </div>
    )
}
export default Post