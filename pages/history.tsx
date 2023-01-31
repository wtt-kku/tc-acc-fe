import {
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import axios from "axios";
import moment from "moment";
import toShowCurrency from "@/utils/currency";
import Swal from "sweetalert2";
import delay from "@/utils/delay";

type Props = {};

interface IncomeTransaction {
  transferor_name: string;
  transferor_bank: string;
  method: string;
  amount: number;
  transaction_date: string;
  time: string;
  remark: string;
  reporter: string;
  id: string;
  create_date: string;
  update_date: string;
  verified: boolean;
}

interface ExpenseTransaction {
  type: string;
  receiver_name: string;
  receiver_bank: string;
  amount: number;
  remark: string;
  reporter: string;
  id: string;
  transaction_date?: string;
  time?: string;
  create_date: string;
  update_date: string;
  verified: boolean;
}

const History = (props: Props) => {
  const [incomes, setIncomes] = React.useState<IncomeTransaction[]>([]);
  const [expenses, setExpenese] = React.useState<ExpenseTransaction[]>([]);
  const router = useRouter();

  const loadIncomes = async () => {
    try {
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/incomes";
      let body = {};
      let result = await axios.post(url, body);
      if (result.data.result) {
        setIncomes(result.data.data);
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
      let url = process.env.NEXT_PUBLIC_API_HOST + "/api/expenses";
      let body = {};
      let result = await axios.post(url, body);
      if (result.data.result) {
        setExpenese(result.data.data);
      } else {
        Swal.fire({
          title: "Error!",
          text: "โหลดรายการเงินเบิกไม่ได้",
          icon: "error",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "โหลดรายการเงินเบิกไม่ได้",
        icon: "error",
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    loadIncomes();
    loadExpenses();
  }, []);

  return (
    <>
      <Container maxWidth="xl">
        <Box style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
          <ArrowBackIosNewIcon fontSize="small" /> กลับหน้าหลัก
        </Box>
        <br />
        <Grid container spacing={2}>
          <Grid item md={6} style={{}}>
            <h3 style={{ color: "green" }}>รายการรับเงินเข้า</h3>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่สร้างรายการ</TableCell>
                    <TableCell align="center">ผู้โอนเข้า / ผู้จ่าย</TableCell>
                    <TableCell align="center">วันเวลาที่โอน</TableCell>
                    <TableCell align="center">จำนวนเงิน</TableCell>
                    <TableCell align="center">สถานะ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomes.map((row, index) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {moment(row.create_date)
                          .utc()
                          .add(7, "hours")
                          .format("YYYY-MM-DD H:mm:ss")}
                      </TableCell>

                      <TableCell align="center">
                        {row.transferor_name}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.transaction_date)
                          .utc()
                          .add(7, "hours")
                          .format("YYYY-MM-DD")}
                        {" " + row.time}น.
                      </TableCell>

                      <TableCell align="right">
                        {toShowCurrency(row.amount)} ฿
                      </TableCell>
                      <TableCell align="right">
                        {row.verified ? (
                          <Chip label="เงินเข้าแล้ว" color="success" />
                        ) : (
                          <Chip label="รอตรวจสอบ" color="primary" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6} style={{}}>
            <h3 style={{ color: "#CD0404" }}>รายการเบิกเงินออก</h3>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>วันที่สร้างรายการ</TableCell>
                    <TableCell align="center">ประเภท</TableCell>
                    <TableCell align="center">ผู้รับเงิน</TableCell>
                    <TableCell align="center">จำนวนเงิน</TableCell>
                    <TableCell align="center">สถานะ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {moment(row.create_date)
                          .utc()
                          .add(7, "hours")
                          .format("YYYY-MM-DD H:mm:ss")}
                      </TableCell>
                      <TableCell align="center">{row.type}</TableCell>
                      <TableCell align="center">{row.receiver_name}</TableCell>
                      <TableCell align="center">
                        {" "}
                        {toShowCurrency(row.amount)} ฿
                      </TableCell>
                      <TableCell align="center">
                        {row.verified ? (
                          <Chip label="โอนเงินแล้ว" color="success" />
                        ) : (
                          <Chip label="รอโอน" color="primary" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default History;
