import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { useState } from 'react';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)

  function getMorePosts() {
    fetch(`${nextPage}`)
      .then(response => response.json())
      .then((data: PostPagination) => {

        const formatedPosts = data.results.map(post => {
          return {
            ...post,
            first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })
          }
        })
        setPosts([...posts, ...formatedPosts])
      })
  }

  return (
    <>
      <Head>
        <title>Spacetraveling | Posts</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} >
              <a key={post.uid} >
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <time> {<FiCalendar />} {post.first_publication_date}</time>
                  <span> {<FiUser />}{post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}
          {nextPage !== null &&
            <a onClick={getMorePosts}>
              <span className={styles.nextPage}> Carregar mais posts</span>
            </a>
          }
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author'],
    pageSize: 1
  });

  const posts: Post[] = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts
  }

  return {
    props: {
      postsPagination
    }
  }
};
