'use strict';
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import RadarChartTemplate from '../components/RadarChart';
import twitterHelpers from '../../utils/twitter-helpers';

class List extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: null,
      selectedHashtag: null
    };
  }

  getUserActivityRadar(tweets) {
    let recentCreatedAt = moment().diff(tweets[0].created_at,"days");
    let oldestCreatedAt = moment().diff(tweets[(tweets.length-1)].created_at,"days");
    let velocity = tweets.length/(oldestCreatedAt - recentCreatedAt);
    let data = {
      'followers': tweets[0].user.followers_count,
      'following': tweets[0].user.friends_count,
      'tweetsPerDay': velocity,
      'likes':tweets[0].user.favourites_count,
      // 'retweets':60
    };

    return (
      <RadarChartTemplate data={data} labels={['followers','following','tweets per day',"likes"]}
      title="How do they use Twitter?"/>
    )
  }

  getUserMentions(tweets) {
    let userReferencesFiltered = twitterHelpers.getUserMentions(tweets);
    let userReferences = _.slice(userReferencesFiltered, 0, 10).map((user)=>{
      return (
        <li key={user.username} onClick={()=>{
          this.setState({selectedUser: user.username})
          console.log(this.state.selectedUser)
        }} >
          {user.username}: {user.count}
        </li>
      )
    });
    return userReferences;
  }

  getHashtags(tweets) {
    let allHashtagsFiltered = twitterHelpers.getHashtags(tweets);
    let allHashtags = _.slice(allHashtagsFiltered, 0, 10).map((hashtag) => {
      return (
        <li key={hashtag.hashtag} onClick={()=>{
          this.setState({selectedHashtag: hashtag.hashtag})
        }} >
          {hashtag.hashtag}: {hashtag.count}
        </li>
      );
    });
    return allHashtags;
  }

  render() {
    let tweets = [];
    let userMentions;
    let hashtags;
    let activityByWeekday;
    let activityByWeek;
    let activityByHour;
    let activityByLocation;
    let repeatedWords;
    let userActivityRadar;
    let repeatedWords1;
    let repeatedWords2;

    if (this.props.tweets.length) {
      if(this.state.selectedUser) {
        tweets = [];
        tweets.push(<p>Tweets mentioning @{this.state.selectedUser}</p>)
        this.props.tweets.map((tweet)=> {
          tweet.entities.user_mentions.map((userMention) => {

            if(userMention.screen_name === this.state.selectedUser) {
              tweets.push(twitterHelpers.tweetTemplate(tweet));
            }
          })
        })
      } else if(this.state.selectedHashtag) {
          tweets = [];
          tweets.push(<p>Tweets with #{this.state.selectedHashtag}</p>)
          this.props.tweets.map((tweet)=> {
            tweet.entities.hashtags.map((hashtag) => {
              if(hashtag.text === this.state.selectedHashtag) {
                tweets.push(twitterHelpers.tweetTemplate(tweet));
              }
            })
          })
      } else {
        tweets = _.slice(this.props.tweets, 0, 30).map((tweet)=>{
          return twitterHelpers.tweetTemplate(tweet);
        });
      }
      userMentions = this.getUserMentions(this.props.tweets)
      hashtags = this.getHashtags(this.props.tweets)
      activityByWeekday = twitterHelpers.getActivityByWeekday(this.props.tweets)
      activityByWeek = twitterHelpers.getActivityByWeek(this.props.tweets)
      activityByHour = twitterHelpers.getActivityByHour(this.props.tweets)
      activityByLocation = twitterHelpers.getActivityByLocation(this.props.tweets)
      repeatedWords = twitterHelpers.getRepeatedWords(this.props.tweets);
      userActivityRadar = this.getUserActivityRadar(this.props.tweets)
      repeatedWords1 = _.slice(repeatedWords, 0,9)
      repeatedWords2 = _.slice(repeatedWords, 10,19)
    }

    return (
      <div className="twitter-container">

        <ul className="side-bar">
          {tweets}
        </ul>

        <div className="user-lists">
          <p>User mentions</p>
          <ul className="user-mentions">
            {userMentions}
          </ul>
          <p>Hashtags used</p>
          <ul className="user-hashtags">
            {hashtags}
          </ul >
          <p>Common words</p>
          <div className="repeated-words">
            <ul className="repeated-words-list">
              {repeatedWords1}
            </ul>
            <ul className="repeated-words-list">
              {repeatedWords2}
            </ul>
          </div>
        </div>

        <div className="activity-charts">
          {activityByWeekday}
          {activityByWeek}
          {activityByHour}
        </div>

        <div className="optional-lists">
          {userActivityRadar}
          <p>Recent locations</p>
          <ul>
            {activityByLocation}
          </ul>
        </div>

      </div>
    );
  }
}

export default List
