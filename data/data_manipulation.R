library(tidyverse)
library(lubridate)


#read the csv files
team_summary <- read_csv("results.csv")   #reading the history files
country_summary <- read_csv("Groups_Flags.csv")  #reading the list of countries participating in 2018 world cup

#subsetting the history dataset to remove the columns for country and city
team_summary <- subset(team_summary, select = -c(city, country ))

#subsetting the country dataset to read the names of teams only; needed for filtering the team names from history
country_summary <- subset(country_summary, select = c(Team))

#combining data from history with the match schedules for stage1 2018
team_summary <- bind_rows(team_summary, new_summary)

#filtering the final dataset to exclude data from before 1928 
#and formatting the date column to have consistent format of dates in a new column
team_summary <- team_summary %>% 
  mutate(Date = as.Date(date, format = "%m/%d/%Y"))%>%
  filter(Date > "1928-01-01")

#dropping the older date column
team_summary <- subset(team_summary, select = -c(date))

#filtering the team/country names from home_team that will not participate in 2018 world-cup
team_summary <- merge(team_summary, country_summary, by.x = "home_team", by.y ="Team", all=FALSE)

#filtering the team/country names from away_team that will not participate in 2018 world-cup
team_summary <- merge(team_summary, country_summary, by.x = "away_team", by.y ="Team", all=FALSE)

#Replacing tournament types other than Friendly, with Competitive
team_summary$tournament[team_summary$tournament!="Friendly"] <- "Competitive"

#ordering the columns by setting date as column 1 and sorting the rows in ascending order by date
team_summary <- team_summary[,c(6,1,2,3,4,5)][order(team_summary$Date),]


#writing the dataset to a csv file
write.csv(team_summary, file = "history_2018.csv", row.names = F)
