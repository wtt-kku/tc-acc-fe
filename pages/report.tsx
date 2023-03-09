import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import moment from "moment";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import toShowCurrency from "@/utils/currency";
import { showMonthTH } from "@/utils/date-helper";
import axios from "axios";
import Swal from "sweetalert2";

type Props = {};

const Report = (props: Props) => {
  const [month, setMonth] = useState<number>(0);
  const [monthQuery, setMonthQuery] = useState<string>(
    new Date().toISOString()
  );

  const [summary, setSummary] = useState<number>(0);

  const [summaryExcludeVat, setSummaryExcludeVat] = useState<number>(0);

  const [budget, setBudget] = useState<number>(0);
  const [dividend, setDividend] = useState<number>(0);

  //รายจ่าย รับจาก API
  const [expenseSum, setExpenseSum] = useState<number>(0);

  const [budgetTotal, setBudgetTotal] = useState<number>(0);

  useEffect(() => {
    setSummaryExcludeVat(summary - (summary / 100) * 7);
  }, [summary]);

  useEffect(() => {
    setBudget((summaryExcludeVat / 100) * 70);
    setDividend((summaryExcludeVat / 100) * 20);
  }, [summaryExcludeVat]);

  useEffect(() => {
    setBudgetTotal(budget - expenseSum);
  }, [expenseSum, budget]);

  useEffect(() => {
    loadIncomes();
    loadExpenses();
  }, [monthQuery]);

  const onMonthChanged = (e: any) => {
    setMonth(e.target.value);
    let reduceMonth = e.target.value;
    let current = new Date(
      new Date().setMonth(new Date().getMonth() - reduceMonth)
    );
    setMonthQuery(current.toISOString());
  };

  const router = useRouter();

  const loadIncomes = async () => {
    try {
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/incomes";
      let body = {
        date: monthQuery,
      };
      let result = await axios.post(url, body);
      if (result.data.result) {
        setSummary(result.data.data.success_summary);
      } else {
        Swal.fire({
          title: "Error!",
          text: "โหลดรายการเงินเข้าไม่ได้",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "โหลดรายการเงินเข้าไม่ได้",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  const loadExpenses = async () => {
    try {
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/expenses-td";
      let body = {
        date: monthQuery,
      };
      let result = await axios.post(url, body);
      if (result.data.result) {
        setExpenseSum(result.data.data.success_summary);
      } else {
        Swal.fire({
          title: "Error!",
          text: "โหลดรายการเบิกไม่ได้",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "โหลดรายการเบิกไม่ได้",
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
              <h2> บัญชีเงินเดือน : </h2>
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

            <Grid item xs={12} md={4} className="frame-income">
              <Typography
                component="h2"
                variant="h6"
                style={{ color: "rgb(12 85 126)" }}
                gutterBottom
              >
                ยอดเงินทั้งหมด
              </Typography>
              <Typography component="p" variant="h4">
                ฿ {toShowCurrency(summary)}
              </Typography>
              <Typography color="text.secondary">ยังไม่หัก VAT 7%</Typography>
            </Grid>

            <Grid item xs={12}>
              <div style={{ paddingTop: 32 }} />
              <h2>
                ยอดหักหลังหักภาษี <b>฿ {toShowCurrency(summaryExcludeVat)}</b>
              </h2>
              <Box style={{ width: "100%", display: "flex" }}>
                <div
                  style={{
                    width: "65%",
                    padding: 4,
                    lineHeight: 2,
                    background: "#AACB73",
                    textAlign: "center",
                    color: "#0b6a00",
                    borderRadius: "14px 0px 0px 14px",
                  }}
                >
                  ฿ {toShowCurrency(budget)} (งบกลาง)
                </div>
                <div
                  style={{
                    width: "35%",
                    padding: 4,
                    lineHeight: 2,
                    background: "#FFC93C",
                    textAlign: "center",
                    borderRadius: "0px 14px 14px 0px",
                    color: "#543505",
                  }}
                >
                  ฿ {toShowCurrency(dividend)} (ปันผล)
                </div>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <div style={{ paddingTop: 32 }} />
              <h2>งบกลาง {toShowCurrency(budget)}</h2>
              {/* <h4>
                ยอดทั้งหมด <Chip label={" ฿ 6,510.00"} color="success" />
              </h4> */}

              <List>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={` ฿ ${toShowCurrency(budget)} `}
                      variant="outlined"
                      color="info"
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemText primary="งบกลาง" />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={` ฿ ${toShowCurrency(expenseSum)} `}
                      variant="outlined"
                      color="error"
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemText primary="เบิกออกไปแล้ว" />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip
                      label={` ฿ ${toShowCurrency(budgetTotal)} `}
                      color="success"
                    />
                  }
                >
                  <ListItemButton>
                    <ListItemText primary="ยอดที่สามารถเบิกได้" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid>

            {/* <Grid item xs={12}>
              <div style={{ paddingTop: 32 }} />
              <h2>ปันผล {toShowCurrency(dividend)}</h2>

              <List>
                <ListItem
                  disablePadding
                  secondaryAction={
                    <Chip label={" ฿ 2,790.-"} color="warning" />
                  }
                >
                  <ListItemButton>
                    <ListItemText primary="รอบที่ 1  (1-9  ก.พ. 2023)" />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding secondaryAction={<i>ยังไม่คำนวณ</i>}>
                  <ListItemButton>
                    <ListItemText primary="รอบที่ 2  (10-19  ก.พ. 2023)" />
                  </ListItemButton>
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding secondaryAction={<i>ยังไม่คำนวณ</i>}>
                  <ListItemButton>
                    <ListItemText primary="รอบที่ 2  (20-28  ก.พ. 2023)" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Grid> */}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Report;
