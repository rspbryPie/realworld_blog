import React, { useEffect, useState } from 'react'
import { Link, Route, Switch, BrowserRouter } from 'react-router-dom'
import { Layout, PageHeader, Avatar, Spin, Result } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import 'antd/dist/antd.min.css'
import ArticleList from '../article-list'
import ArticlePage from '../article-page/article-page'
import ArticleForm from '../article-form'
import Profile from '../profile'
import { logOut, setUserLocal } from '../../store/userSlice'

import noAvatar from './no-avatar.jpg'
import styles from './app.module.scss'

const { Content } = Layout

export default function App() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [internet, setInternet] = useState(true)

  useEffect(() => {
    if (!user.authorization) {
      dispatch(setUserLocal())
    }
    window.addEventListener('offline', () => {
      setInternet(false)
    })
    window.addEventListener('online', () => {
      setInternet(true)
    })
  }, [dispatch, user.authorization])

  const noAuthUser = [
    <Link to="/sign-in" className={styles.header__link}>
      Sign in
    </Link>,
    <Link to="/sign-up" className={classNames([styles.header__link], [styles.header__link_up])}>
      Sign Up
    </Link>,
  ]
  const authUser = [
    <Link to="/new-article" className={styles['create-article-link']}>
      Create Article
    </Link>,
    <Link to="/profile" className={styles.profile}>
      <h6 className={styles.profile__name}>{user.user.username}</h6>
      <Avatar src={user.user.image || noAvatar} size={46} />
    </Link>,
    <Link to="/articles">
      <button onClick={() => dispatch(logOut())} type="button" className={styles['logout-btn']}>
        Log Out
      </button>
    </Link>,
  ]

  const profile = user.authorization ? authUser : noAuthUser

  const content = internet ? (
    <BrowserRouter>
      <PageHeader
        className={styles.header}
        title={
          <Link to="/articles" className={styles.header__link}>
            Realworld Blog
          </Link>
        }
        extra={user.load ? [<Spin size="large" style={{ marginRight: '100px' }} />] : profile}
      />
      <Content className={styles.app__content}>
        <Switch>
          <Route path="/articles" exact component={ArticleList} />
          <Route path="/articles/:slug" exact render={({ match }) => <ArticlePage slug={match.params.slug} />} />
          <Route path="/sign-up" render={() => <Profile status="register" />} />
          <Route path="/sign-in" render={() => <Profile status="login" />} />
          <Route path="/profile" render={() => <Profile status="edit" />} />
          <Route path="/new-article" component={ArticleForm} />
          <Route
            path="/articles/:slug/edit"
            render={({ match }) => <ArticleForm status="edit" slug={match.params.slug} />}
          />
          <Route path="*" exact component={ArticleList} />
        </Switch>
      </Content>
    </BrowserRouter>
  ) : (
    <Result
      icon={<ApiOutlined style={{ color: 'red' }} />}
      title="Problems with connection"
      subTitle="Check your internet connection and reload the page!"
    />
  )

  return <Layout className={styles.app}>{content}</Layout>
}
