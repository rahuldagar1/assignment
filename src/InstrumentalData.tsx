import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowClassParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./InstrumentalData.css";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Tooltip,
  Stack,
  Paper,
  Link,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

// Types
interface FinancialInstrument {
  ticker: string;
  price: number;
  assetClass: "Commodities" | "Equities" | "Credit";
}

const assetClassOrder: Record<FinancialInstrument["assetClass"], number> = {
  Commodities: 0,
  Equities: 1,
  Credit: 2,
};

export const InstrumentalData = () => {
  const [rowData, setRowData] = useState<FinancialInstrument[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [originalData, setOriginalData] = useState<FinancialInstrument[]>([]);

  useEffect(() => {
    const generateMockData = (): FinancialInstrument[] => {
      const assetClasses: FinancialInstrument["assetClass"][] = [
        "Commodities",
        "Equities",
        "Credit",
      ];
      return Array.from({ length: 1000 }).map((_, i) => ({
        ticker: `TICKER${i + 1}`,
        price: parseFloat((Math.random() * 10000 - 5000).toFixed(2)),
        assetClass:
          assetClasses[Math.floor(Math.random() * assetClasses.length)],
      }));
    };

    const fetchData = async () => {
      await new Promise((res) => setTimeout(res, 500));
      setOriginalData(generateMockData())
      setRowData(generateMockData());
    };

    fetchData();
  }, []);

  const columnDefs = useMemo<ColDef<FinancialInstrument>[]>(() => [
    { headerName: "Ticker", field: "ticker", sortable: false },
    {
      headerName: "Price",
      field: "price",
      sortable: false,
      valueFormatter: (params) => params.value.toFixed(2),
      cellClass: (params) =>
        params.value >= 0 ? "price-positive" : "price-negative",
    },
    { headerName: "Asset Class", field: "assetClass", sortable: false },
  ], []);

  const getRowClass = (params: RowClassParams<FinancialInstrument>) => {
    const data = params.data;
    if (!data) return "";
    switch (data.assetClass) {
      case "Commodities": return "row-commodities";
      case "Equities": return "row-equities";
      case "Credit": return "row-credit";
      default: return "";
    }
  };

  const sortByAssetClass = useCallback(() => {
    setRowData([...rowData].sort((a, b) => assetClassOrder[a.assetClass] - assetClassOrder[b.assetClass]));
  }, [rowData]);

  const sortByPrice = useCallback(() => {
    setRowData([...rowData].sort((a, b) => b.price - a.price));
  }, [rowData]);

  const sortByTicker = useCallback(() => {
    setRowData([...rowData].sort((a, b) => a.ticker.localeCompare(b.ticker)));
  }, [rowData]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const resetSort =()=>{
      setRowData(originalData);
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* Header */}
      <AppBar position="sticky" sx={{ boxShadow: 3, background: "linear-gradient(90deg, #3f51b5, #4caf50)" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo or Title */}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              <Link href="#" color="inherit" underline="none">
                Financial Instruments Dashboard
              </Link>
            </Typography>

            {/* Navigation Links or Menu */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Link href="#" color="inherit" underline="hover">
                Home
              </Link>
              <Link href="#" color="inherit" underline="hover">
                About
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Dashboard
              </Link>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Side Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
      </Menu>

      {/* Main Content */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Financial Instruments Table
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mb={3} flexWrap="wrap">
            <Tooltip title="Sort: Commodities → Equities → Credit" arrow>
              <Button variant="outlined" onClick={sortByAssetClass}>
                Sort by Asset Class
              </Button>
            </Tooltip>
            <Tooltip title="Sort: Price descending" arrow>
              <Button variant="outlined" onClick={sortByPrice}>
                Sort by Price
              </Button>
            </Tooltip>
            <Tooltip title="Sort: Ticker A → Z" arrow>
              <Button variant="outlined" onClick={sortByTicker}>
                Sort by Ticker
              </Button>
            </Tooltip>
            <Tooltip title="Reset sorting" arrow>
              <Button variant="outlined" onClick={resetSort}>
                Reset Sorting
              </Button>
            </Tooltip>
          </Stack>

          <Box className="ag-theme-balham" sx={{ height: 600, width: "100%" }}>
            <AgGridReact<FinancialInstrument>
              rowData={rowData}
              columnDefs={columnDefs}
              getRowClass={getRowClass}
              defaultColDef={{
                resizable: true,
                sortable: false,
                flex: 1,
              }}
            />
          </Box>
        </Paper>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, textAlign: "center", backgroundColor: "#f1f1f1" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Financial Instruments App
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
