# Who will win the World Cup 2018?

FIFA World Cup 2018 will be taking place in Russia this year, we want to predict and visualize which team is more likely to win this year’s World Cup based on their performance in the past 90 years. 

## A. Description of the Data**
1. We used two datasets for our visualization. 
2. International football results from 1872 to 2018.
3. 2018 World Cup dataset 

**Description of Data:**

We took the football history data in CSV file format from Kaggle [data_manipulation.R]. The CSV file contain result of football matches from year 1872 to 2018. This dataset consist of date, home_team, away_team, home_score, away_score,  tournament, city and country. 
We created this dataset by collecting team names, flags image and grouping for the teams playing in 2018 World Cup from the 2018 FIFA World Cup web page [2]. We saved these data in a CSV file format.

**Data Formatting and Filtering:**

We used R for most of the data formatting and clean-up (data_manipulation.R):

For the historical matches dataset, we are interested in the date, team names, scores and tournament data for the 32 teams that have qualified for World Cup 2018. Moreover, since football matches are 90 minutes long, we decided to consider only matches for these teams in the past 90 years. 

We filtered this dataset first by:

1. Dropping the city and country columns
2. We then filtered the rows to keep data for dates greater than 1928-01-01
3. We then took the Team column containing country names for teams that qualified for 2018 World Cup, from the 2018 World Cup dataset (groups_flags.csv) to filter the team_home and team_away columns in historical matches dataset (results.csv).
4. The final step was to replace the values in tournament column in history dataset (results.csv) with Competitive or Friendly. All matches are labeled Competitive unless they were labeled Friendly in the original dataset.

We save the manipulated dataset as history_2018.csv.

We also used:
- countries_flag_links.csv - contain the links to the team flags on World Cup 2018 website 
- wc_2018_grp_schedule.csv - contain match schedules for World Cup 2018
- groups_flags.csv - contain groupings for World Cup 2018

## B. Data to Visual Elements Mapping
Our data visualization includes three sections: the description with the controls, the  knockout tree based on our prediction, and the details panel listing the past encounters between two teams.

Our visualization is inspired by the traditional knockout tree for a sporting competition. This kind of data visualization represent the progress of a sporting event with a clear structure. However, with all the matches presented in the tree, we need to carefully design the hierarchy of information we wish to convey to our audience. We also need to provide our audience with interactive controls to highlight relevant information. 

The node of the trees represent the prediction for each match in the upcoming World Cup 2018 based on the history encounters between two teams. The score of the each game is the average score of the all the past encounters in the selected period between two  team. 

For the group stage, we used the actual grouping and schedule available. The top two teams from each group after three group stage matches will qualify for the knockout stage. According to the World Cup rules, If there is a tie in points, the team with higher goal difference and goals scored will qualify. 
In the knockout stage, if there is a tie, we picked the winner at random. The randomness reflect the unpredictability of a penalty shootout of an actual game.

For our prediction, there are mainly two concerns: 
1. Is it reasonable to use historical result to predict the future result, as the strength of each team changes through the years? To solve this, we provide a dropdown menu to allow our users to choose the number of years they want to go back in history for the average score calculation. 
2. Friendly games result cannot accurately represent the difference in strength between two teams. To solve this, we allow our audience to control what type of matches we included in our calculation with checkboxes. We also provide a visual cue using emoji like 🏆 and 🤝 to represent Competitive and Friendly matches respectively. 

Therefore, our prediction is flexible and our audience can choose the combination that make most sense to them using the controls provided. 

For the visual presentation, we used a rectangular card to represent each match information. We show the 3 characters abbreviation for each team with their flags and the average score based on the past encounters. By clicking on the card, the past encounters will be shown in the detail panel on the right. The background of the selected match card will also be set to a gold color as the card pops up with drop shadow effect; using code from [3]; to represent the active state. 

We designed a bar chart to represent all the past encounters that we have included in the calculation. We used football emoji ⚽ to represent goals for each encounter. We truncated the goals to 6 goals due to space limitation. As a analogy to the minutes of a football game, we only show the last two digits of the year for each encounter. We also use the same emoji 🏆and 🤝to represent Competitive and Friendly matches respectively. 

As mentioned earlier, the tree with all 64 matches can be challenging for our user to identify useful information. Hence, we provide a dropdown menu for user to select and follow the journey of their favorite team. The reduction in opacity for team not selected and increase in opacity of the selected team provide a contrast that clearly highlight the path of the selected team in our predicted World Cup.

In addition, we have also added a hidden easter egg. By simply hovering the mouse over the text “We are the champions!”, there will be firework animations to celebrate the winning team. We build this animation based on the code from [4]. 

## C. The Story
Predicting the champion of World Cup is one of the most popular and exciting activity for any football fans before each World Cup. There are different ways to make the predictions. Some are based on the odds provided by betting companies. Some allow users to fill in the winning team of each match and automatically generate the winning path. Some are based on really complex algorithms that take into consideration many factors that affect a football team. 

As football fans, we wish to make our prediction based on the past encounters of two teams over a period of 90 years. Who will be the world champion if we map a 90 minutes football game to 90 years? Therefore, we designed this data visualization and hope to provide an interesting tool to predict the champion for our audience. 

We decided to use past encounters for our predictions because it tells us the difference in quality between two teams statistically and these historical results affect the mentality of the players. Players in a team that is often on a losing end would be less confident in  stopping history from repeating itself and the lack of confidence before the start of a match is detrimental in a high pressure football match such as the World Cup.  

We do not aim to have the most accurate prediction but we aim to give our audience a useful tool to look at the past encounters between teams and also how these encounters could have determine the fate of their favorite team in the upcoming World Cup. In order to provide a tool that is simple to understand and use, we decided not to include other factors like the team current world ranking, quality of players, distance between matches etc. Although these factors will definitely improve the accuracy of our prediction, we think they will distract our audience from exploring the impact of historical wins between team on their performance.

To interact with the visualization, users can
1. Select a team and highlight the journey of that team;
2. Select the range of matches they want to include in the prediction;
3. Select the type of games they want to include in the prediction;
4. Click on any game to see the details of past encounters between two teams. 


References:
[1] International football results from 1872 to 2018 [https://www.kaggle.com/martj42/international-football-results-from-1872-to-2017/data]( https://www.kaggle.com/martj42/international-football-results-from-1872-to-2017/data )
[2] Flags, teams, groups data [https://www.fifa.com/worldcup/]( https://www.fifa.com/worldcup/ )
[3] Drop shadow:[http://bl.ocks.org/cpbotha/5200394](http://bl.ocks.org/cpbotha/5200394 )
[4] mf2fm.com is home to the Random Town Name Generator (RaToNaGe), RV's free text and graphic javascript effects, Sheffield's worst pirate radio station ZFM, Guildford Campus Radio 1602AM and a whole lot of other rubbish. [http://www.mf2fm.com/](http://www.mf2fm.com/)


### Authors

Zhengnan Zhao (zz528), Yong Lin Ong (yo228), Aisha Anwer (aa2499)
