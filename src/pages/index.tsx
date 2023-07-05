import { Inter } from 'next/font/google'
import { TokenClass } from 'typescript'
import { useEffect, useState } from 'react'
import { getCookie, setCookie } from 'cookies-next'
import axiosInterceptorInstance from '../../utils/axiosGlobal'
import ld from 'lodash'
import { type } from 'os'

type Video = {
  id: number
  content: string
}

type Article = {
  id: number
  title: string
  content: string
}

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [token, setToken] = useState(false as any)
  const [email, setEmail] = useState(false as any)
  const [myArticle, setMyArticle] = useState(false as any)
  const [myVideos, setMyVideos] = useState(false as any)
  const [allVideo, setAllVideos] = useState(false as any)
  const [allArticle, setAllArticle] = useState(false as any)
  const [membership, setMembership] = useState(false as any)

  useEffect(() => {
    const token = getCookie('token')
    const email = getCookie('email')
    const membership = getCookie('membership')

    if (email) setEmail(String(email))
    if (token) setToken(String(token))
    if (membership) setMembership(membership)

    if (membership) {
      handleGetVideo()
      handleGetArticle()
      handleGetAllArticle()
      handleGetAllVideo()
    }
  }, [])


  const handleGetVideo = () => {
    axiosInterceptorInstance.get('user/my_video').then((data) => {
      setMyVideos(ld.map(data.data, 'video'))
    }).catch(e => console.log(e))
  }

  const handleGetArticle = () => {
    axiosInterceptorInstance.get('user/my_article').then((data) => {
      setMyArticle(ld.map(data.data, 'article'))
    }).catch(e => console.log(e))
  }

  const handleGetAllArticle = () => {
    axiosInterceptorInstance.get('content/articles').then((data) => {
      setAllArticle(data.data)
    }).catch(e => console.log(e))
  }

  const handleGetAllVideo = () => {
    axiosInterceptorInstance.get('content/videos').then((data) => {
      setAllVideos(data.data)
    }).catch(e => console.log(e))
  }

  const addToCollection = (type: 'video' | 'article', id: number) => {
    axiosInterceptorInstance.get('user/choose_' + type + '?' + type + '_id=1').then((data) => {
      if (type == 'video') handleGetVideo()
      if (type == 'article') handleGetArticle()
      alert('success')
    }).catch(e => alert(e.response.data.message))
  }

  const updatePlan = (plan: number) => {
    axiosInterceptorInstance.get('membership/update_plan?plan_id=' + plan).then((data) => {
      handleGetAllArticle()
      handleGetAllVideo()
    }).then(() => {
      setCookie('membership', plan)
      alert('success')
      window.location.reload()
    }).catch(e => console.log(e))
  }

  return (
    <main
      className={`flex flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl  font-mono text-sm lg:flex">
        <div className="">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By E.P.B.A
          </a>
        </div>
      </div>

      <div className="">
        <span className='text-4xl font-extrabold'>
          Access Videos / Articles
        </span>
      </div>

      {!token as boolean &&
        <button
          onClick={() => window.location.href = 'http://localhost:3001/api/auth/google/login'}
          className="text-white p-3 h-12 bg-red-600 rounded-lg hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none">
          LOGIN WITH GOOGLE
        </button>
      }

      {email as boolean && <div className="">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        >
          Hy {email}
        </a>
      </div>}

      {!membership && token &&
        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left">
          <a
            onClick={() => updatePlan(1)}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Type A {' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              3 VIDEO + 3 ARTICLE
            </p>
          </a>

          <a
            onClick={() => updatePlan(2)}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Type B {' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              10 VIDEO + 10 ARTICLE
            </p>
          </a>

          <a
            onClick={() => updatePlan(3)}
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Type C {' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              UNLIMITED VIDEO + UNLIMITED ARTICLE
            </p>
          </a>


        </div>
      }

      <div className='mt-40'></div>

      {membership &&
        <div className="">
          <span className='text-4xl font-extrabold'>
            Your Videos
          </span>
          <div className='mt-4'></div>
          <div className='w-full'>
            <div className='grid grid-cols-4 gap-6'>
              {myVideos.length && myVideos.map((e: Video, i: number) => {
                return <iframe key={i} className='w-full h-52 bg-black' src={e.content}>
                </iframe>
              })}
            </div>

          </div>
        </div>
      }

      <div className='mt-40'></div>

      {membership && <div className="justify-start">
        <span className='text-4xl font-extrabold'>
          Your Article
        </span>
        <div className='mt-4'></div>
        <div className='w-full'>
          <div className='grid grid-cols-4 gap-6'>
            {myArticle.length && myArticle.map((e: Article, i: number) => {
              return <div className='bg-white shadow-lg h-52 w-54 p-4' key={i}>
                <div className="truncate box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">
                  {e.title}
                </div>
                <div className='overflow-hidden'>
                  <div className=" h-52 mt-4">{e.content}</div>
                </div>
              </div>
            })}
          </div>

        </div>
      </div>
      }

      <div className='mt-40'></div>



      {token && membership &&
        <div className="">
          <span className='text-4xl font-extrabold'>
            Choose Your Videos
          </span>
          <div className='mt-4'></div>
          <div className='w-full'>
            <div className='grid grid-cols-4 gap-6'>
              {allVideo.length && allVideo.map((e: Video, i: number) => {
                return <div className='w-full h-52'>
                  <iframe key={i} className='' src={e.content} >
                  </iframe>
                  <a className='mt-4 text-white p-3 h-12 bg-red-600 rounded-lg hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none' onClick={() => addToCollection('video', e.id)}>Add To My Collection</a>
                </div>
              })}
            </div>

          </div>
        </div>
      }

      <div className='mt-40'></div>

      {token && membership &&
        <div className="justify-start">
          <span className='text-4xl font-extrabold'>
            Choose Your Article
          </span>
          <div className='mt-4'></div>
          <div className='w-full'>
            <div className='grid grid-cols-4 gap-6'>
              {allArticle.length && allArticle.map((e: Article, i: number) => {
                return <div className='bg-white shadow-lg h-52 w-54 p-4 overflow-hidden overflow-y-scroll' key={i}>
                  <div className="truncate box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2">
                    {e.title}
                  </div>
                  <button onClick={() => addToCollection('article', e.id)} className='text-white p-3 h-12 bg-red-600 rounded-lg hover:bg-red-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none'>Add To My Collection</button>
                  <div className='overflow-hidden'>
                    <div className=" h-52 mt-4">{e.content}</div>
                  </div>
                </div>
              })}
            </div>

          </div>
        </div>
      }
    </main>
  )
}
