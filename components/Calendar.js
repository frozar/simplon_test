import Grid from "@mui/material/Grid";

import Timeline, {
  TimelineHeaders,
  DateHeader,
} from "react-calendar-timeline/lib";
import moment from "moment";
// make sure you include the timeline stylesheet or the timeline
// will not be styled
import "react-calendar-timeline/lib/Timeline.css";

export default function Calendar(props) {
  const { groups, items, calendarWidth } = props;
  return (
    <Grid
      container
      item
      style={{
        width: `${calendarWidth}px`,
        display: "block",
      }}
    >
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().add(-12, "hour")}
        defaultTimeEnd={moment().add(12, "hour")}
      >
        <TimelineHeaders className="sticky">
          <DateHeader unit="primaryHeader" />
          <DateHeader />
        </TimelineHeaders>
      </Timeline>
    </Grid>
  );
}
