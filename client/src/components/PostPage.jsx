import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/sub_components/Loading.jsx";
import { Alert, Button } from "flowbite-react";
import CommentSection from "./sub_components/CommentSection.jsx";
import PostCard from "./sub_components/PostCard.jsx";


export default function PostPage() {
    const [author, setAuthor]=useState({});
    const { slug } = useParams();
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const [post, setPost] = useState({});

const [recent,setrecent]= useState(null); 



const fetchUser = async () => {
    try {
        const res = await fetch("/api/user/getUserbyId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: post.userId }), 
        });
        const data = await res.json(); 
        if (res.ok) {
            setAuthor(data.user); 
        } else { 
            setAuthor("Author not found"); 
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}


useEffect(() => {
    console.log(slug);
 
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/admin/getPosts?slug=" + slug);
            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                setLoading(false);
                throw new Error(data.message);
            } else {
                console.log(data);
                setPost(data.posts[0]);
                console.log(data.posts[0]);
                setLoading(false);
                setError(null);
            }
        } catch (error) {
            setLoading(false);
            setError(error);
            console.log(error);
        }
    };
    fetchPost();

}, [slug]);

useEffect(() => {
    console.log(slug);
 
    const fetchPost = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/admin/getPosts?limit=3" + slug);
            const data = await res.json();
            if (!!res.ok) {
                setrecent(data.posts);
                console.log(recent);
            } 
        } catch (error) {
            setLoading(false);
            setError(error);
            console.log(error);
        }
    };
    fetchPost();

}, [slug]);

useEffect(() => {
    if (post.userId) {
        fetchUser();
    }
}, [post]);


    if (loading) return <Loading></Loading>;
    else
        return (
            <main className="p-4 flex flex-col max-w-6xl mx-auto min-h-screen mt-16">
                <h1 className="text-center mt-6 font-bold lg:text-4xl">
                    {post.title}
                </h1>
                <Link
                    className="self-center mt-5"
                    to={`/search?category=${post.category}`}
                >
                    <Button size="xs" color="grey" outline pill>
                        {post.category}
                    </Button>
                </Link>

                <img
                    className="mt-10 p-5 max-h-[600px] w-full object-cover resize-none"
                    loading="lazy"
                    src={post.image}
                ></img>

                <div className="flex justify-between text-xs text-slate-500 p-1 border-t border-slate-500 mx-auto w-full max-w-4xl">
                    <span className="italic">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="italic">Written by {author.username}</span>
                    <span>{post.content ? ((post.content.length / 1000).toFixed(0) + " mins read") : "Loading..."}</span>
                </div>

                <div className="max-w-4xl w-full p-1 mx-auto mt-10  postCon " dangerouslySetInnerHTML={{ __html: post.content }}></div>
                


            {error && <Alert color={"failure"}>
                {error.message}
                </Alert>}


<div className= "mt-16">
              <CommentSection postId={post._id}></CommentSection>  
</div>
    
<div className="flex flex-col justify-center items-center mt-32 mb-10 border-b-2 border-green-800 ">
    <h1 className="text-center mb-4">Recent Posts</h1>
    <div className="flex flex-wrap justify-center gap-10 md:flex-row md:gap-3 sm:flex-col sm:gap-3 ">
    {recent &&
        recent.map((p) => (
            <PostCard key={p._id} post={p}></PostCard>
        ))}
</div>
</div>
            </main>
        );
}
