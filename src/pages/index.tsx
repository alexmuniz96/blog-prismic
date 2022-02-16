import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { getPrismicClient } from '../services/prismic';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

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

export default function Home() {
  const nextPage = true

  return (
    <>
      <Head>
        <title>Spacetraveling | Posts</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <time> <strong>{<FiCalendar />} </strong>15 Mar 2021</time>
              <span> <strong>{<FiUser />}</strong>Joseph Oliveira</span>
            </div>
          </a>
          <a href="">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <time> <strong>{<FiCalendar />} </strong>15 Mar 2021</time>
              <span> <strong>{<FiUser />}</strong>Joseph Oliveira</span>
            </div>
          </a>
          <a href="">
            <strong>Como utilizar Hooks</strong>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.info}>
              <time> <strong>{<FiCalendar />} </strong>15 Mar 2021</time>
              <span> <strong>{<FiUser />}</strong>Joseph Oliveira</span>
            </div>
          </a>
          {nextPage === true &&
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
    fetch: ['post.title', 'post.subtitle', 'post.author']
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR }),
    }

  })
  console.log(postsResponse.results)

  return {
    props: {
      // posts
    }
  }
};
