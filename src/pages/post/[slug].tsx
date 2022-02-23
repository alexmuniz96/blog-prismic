import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  const amountWordsOfBody = RichText.asText(
    post.data.content.reduce((acc, data) => {
      return [...acc, ...data.body]
    }, [])
  ).split(/\s+/).length

  const amountWordsOfHeading = post.data.content.reduce((acc, data) => {
    if (data.heading) {
      return [...acc, ...data.heading.split(/\s+/)];
    }
    return [...acc]
  }, []).length

  const readTime = Math.ceil((amountWordsOfBody + amountWordsOfHeading) / 200)

  return (
    <>
      <Head>
        <title>{post.data.title} | Ignews</title>
      </Head>

      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="" />
      </div>

      <main className={commonStyles.container}>
        <header className={styles.header}>
          <h1>{post.data.title}</h1>
        </header>
        <div className={styles.postInfo}>
          <time> <FiCalendar />{post.first_publication_date}</time>
          <span> <FiUser />{post.data.author}</span>
          <span> <FiClock /> {readTime} min</span>
        </div>
        {post.data.content.map(content => (
          <article className={styles.postCotent} key={content.heading}>
            <h2>{content.heading}</h2>
            {content.body.map(text => (
              <p key={text.text}>{text.text}</p>
            ))}
          </article>
        ))}
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ], {
    pageSize: 1
  });

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'dd MMM yyyy', { locale: ptBR }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content
    }
  }

  return {
    props: {
      post
    },
    redirect: 60 * 30
  }
};
