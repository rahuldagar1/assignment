import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InstrumentalData } from "./InstrumentalData";

const getGridRows = () => screen.getAllByRole('row').filter(row => row.className.includes('ag-row'));

describe("InstrumentalData", () => {
  test("renders dashboard title and table", () => {
    render(<InstrumentalData />);
    expect(screen.getByTestId("sort-asset-class")).toBeInTheDocument();
    expect(screen.getByTestId("sort-price")).toBeInTheDocument();
    expect(screen.getByTestId("sort-ticker")).toBeInTheDocument();
    expect(screen.getByTestId("reset-sorting")).toBeInTheDocument();
  });

  test("renders ag-grid with data after loading", async () => {
    render(<InstrumentalData />);
    await waitFor(() => {
      expect(getGridRows().length).toBeGreaterThan(0);
    });
  });

    test("renders data", async () => {
        render(<InstrumentalData />);
        await waitFor(() => {
        expect(getGridRows().length).toBeGreaterThan(0);
        });
    });


  test("reset sorting restores original data", async () => {
    render(<InstrumentalData />);
    await waitFor(() => getGridRows().length > 0);
    const getTickerCells = () => {
      return screen.queryAllByText(/^TICKER\d+$/).map(cell => cell.textContent);
    };
    fireEvent.click(screen.getByTestId("sort-price"));
    fireEvent.click(screen.getByTestId("reset-sorting"));
    await waitFor(() => {
      const after = getTickerCells();
      expect(after.length).toBeGreaterThan(0);
    });
  });

});
