import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  const { next_page } = postsPagination
  const { results } = postsPagination
  console.log(results)

  return (
    <>
      <Head>
        <title>Spacetraveling | Posts</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {results.map(post => (
            <a key={post.uid} href="">
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.info}>
                <time> <strong>{<FiCalendar />} </strong>{post.first_publication_date}</time>
                <span> <strong>{<FiUser />}</strong>{post.data.author}</span>
              </div>
            </a>
          ))}
          {next_page &&
            <span className={styles.nextPage}> Carregar mais posts</span>
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
    pageSize: 1,
  });

  const posts = postsResponse.results.map(post => {
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
  const nextPage = postsResponse.next_page

  return {
    props: {
      postsPagination: {
        nextPage,
        results: posts
      }
    }
  }
};
