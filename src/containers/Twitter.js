import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import RadarChartTemplate from '../components/RadarChart';
import twitterHelpers from '../../utils/twitter-helpers';

class List extends Component {
  getUserActivityRadar(tweets) {
    let data = {
      'followers':150,
      'following':600,
      'tweetsPerDay':2,
      'likes':300,
      'retweets':60
    }

    return (
      <RadarChartTemplate data={data} labels={['followers','following','tweets per day','likes', 'retweets']}
      title="How do they use Twitter?"/>
    )
  }

  render() {
    let tweets;
    let userMentions;
    let hashtags;
    let activityByWeekday;
    let activityByWeek;
    let activityByHour;
    let activityByLocation;
    let repeatedWords;
    let userActivityRadar;

    if (this.props.tweets.length) {
      tweets = _.slice(this.props.tweets, 0, 15).map((tweet)=>{
        return twitterHelpers.tweetTemplate(tweet);
      });
      userMentions = twitterHelpers.getUserMentions(this.props.tweets)
      hashtags = twitterHelpers.getHashtags(this.props.tweets)
      activityByWeekday = twitterHelpers.getActivityByWeekday(this.props.tweets)
      activityByWeek = twitterHelpers.getActivityByWeek(this.props.tweets)
      activityByHour = twitterHelpers.getActivityByHour(this.props.tweets)
      activityByLocation = twitterHelpers.getActivityByLocation(this.props.tweets)
      repeatedWords = twitterHelpers.getRepeatedWords(this.props.tweets);

      userActivityRadar = this.getUserActivityRadar(this.props.tweets)
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
          <ul>
            {repeatedWords}
          </ul>
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
