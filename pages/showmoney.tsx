import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { showMonthTH } from "@/utils/date-helper";
import moment from "moment";
import toShowCurrency from "@/utils/currency";
import axios from "axios";
import Swal from "sweetalert2";

type Props = {};

const ShowMoney = (props: Props) => {
  const router = useRouter();
  const [month, setMonth] = useState<number>(0);
  const [monthQuery, setMonthQuery] = useState<string>(
    new Date().toISOString()
  );

  const [sumMoney, setSumMoney] = useState<number>(0);
  const [sumR1, setSumR1] = useState<number>(0);
  const [sumR2, setSumR2] = useState<number>(0);
  const [sumR3, setSumR3] = useState<number>(0);

  const onMonthChanged = (e: any) => {
    setMonth(e.target.value);
    let reduceMonth = e.target.value;
    let current = new Date(
      new Date().setMonth(new Date().getMonth() - reduceMonth)
    );
    console.log(current.toISOString());
    setMonthQuery(current.toISOString());
  };

  useEffect(() => {
    loadMoney();
  }, [monthQuery]);

  const loadMoney = async () => {
    try {
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/show-money";
      let body = {
        date: monthQuery,
      };
      let result = await axios.post(url, body);
      if (result.data.result) {
        setSumMoney(result.data.data.sum);
        setSumR1(result.data.data.r1);
        setSumR2(result.data.data.r2);
        setSumR3(result.data.data.r3);
      } else {
        Swal.fire({
          title: "Error!",
          text: "โหลดรายการไม่ได้",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "โหลดรายการไม่ได้",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box style={{ paddingTop: 16 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/")}
            startIcon={<ArrowBackIosIcon />}
          >
            กลับหน้าหลัก
          </Button>
        </Box>
        <br />
        <Box style={{ padding: 8 }}>
          <Grid container>
            <Grid item xs={12} wrap="nowrap" style={{ paddingBottom: 32 }}>
              <h2> เงินแบ่งเดือน : </h2>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">เดือน</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={month}
                  label="เดือน"
                  onChange={onMonthChanged}
                >
                  <MenuItem value={0}>
                    {showMonthTH[new Date().getMonth()]}{" "}
                    {moment(new Date()).utc().add(543, "year").format("YYYY")}
                  </MenuItem>
                  <MenuItem value={1}>
                    {
                      showMonthTH[
                        new Date(
                          new Date().setMonth(new Date().getMonth() - 1)
                        ).getMonth()
                      ]
                    }{" "}
                    {moment(
                      new Date(new Date().setMonth(new Date().getMonth() - 1))
                    )
                      .utc()
                      .add(543, "year")
                      .format("YYYY")}
                  </MenuItem>
                  <MenuItem value={2}>
                    {
                      showMonthTH[
                        new Date(
                          new Date().setMonth(new Date().getMonth() - 2)
                        ).getMonth()
                      ]
                    }{" "}
                    {moment(
                      new Date(new Date().setMonth(new Date().getMonth() - 2))
                    )
                      .utc()
                      .add(543, "year")
                      .format("YYYY")}
                  </MenuItem>
                  <MenuItem value={3}>
                    {
                      showMonthTH[
                        new Date(
                          new Date().setMonth(new Date().getMonth() - 3)
                        ).getMonth()
                      ]
                    }{" "}
                    {moment(
                      new Date(new Date().setMonth(new Date().getMonth() - 3))
                    )
                      .utc()
                      .add(543, "year")
                      .format("YYYY")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4} className="frame-money">
              <Typography
                component="h2"
                variant="h6"
                style={{ color: "rgb(122 62 13)" }}
                gutterBottom
              >
                เงินปันผลสะสม
              </Typography>
              <Typography component="p" variant="h4">
                ฿ {toShowCurrency(sumMoney)}
              </Typography>
              <Typography color="text.secondary">สะสมตลอดทั้งเดือน</Typography>
            </Grid>

            <Grid item xs={12} md={8}></Grid>

            <Grid item xs={12}>
              <div style={{ paddingTop: 32 }} />
              <h2>รอบการแบ่ง</h2>
              {/* <h4>
                ยอดทั้งหมด <Chip label={" ฿ 6,510.00"} color="success" />
              </h4> */}

              <List>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={` ฿ ${toShowCurrency(sumR1)} `}
                      color="warning"
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={`รอบที่ 1 (1-9 ${
                        showMonthTH[
                          parseInt(moment(monthQuery).format("MM")) - 1
                        ]
                      })`}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={` ฿ ${toShowCurrency(sumR2)} `}
                      color="warning"
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={`รอบที่ 2 (10-19 ${
                        showMonthTH[
                          parseInt(moment(monthQuery).format("MM")) - 1
                        ]
                      })`}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={` ฿ ${toShowCurrency(sumR3)} `}
                      color="warning"
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={`รอบที่ 3 (20-${moment(monthQuery)
                        .endOf("month")
                        .format("DD")} ${
                        showMonthTH[
                          parseInt(moment(monthQuery).format("MM")) - 1
                        ]
                      }) `}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>

            {/* <Grid item xs={12} md={4} >
              <Typography
                component="h2"
                variant="h6"
                style={{ color: "rgb(12 85 126)" }}
                gutterBottom
              >
                ยอดแบ่งส่วนที่ 3
              </Typography>
              <Typography component="p" variant="h4">
                ฿ {toShowCurrency(25670.77)}
              </Typography>
              <Typography color="text.secondary">
                1-9 กุมภาพันธ์ 2566
              </Typography>
            </Grid> */}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default ShowMoney;
