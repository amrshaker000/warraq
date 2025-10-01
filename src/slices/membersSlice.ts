import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Member, MemberStats } from "../types/member";
import { CsvService } from "../services/enhancedCsvService";

// Async thunks
export const getMembers = createAsyncThunk("members/getMembers", async () => {
  return CsvService.getInstance().getAllMembers();
});

export const addMember = createAsyncThunk(
  "members/addMember",
  async (member: Omit<Member, "id" | "createdAt" | "updatedAt">) => {
    const newMember = {
      ...member,
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Member;

    const success = await CsvService.getInstance().addMember(newMember);
    if (!success) {
      throw new Error("Failed to add member - duplicate data found");
    }
    return CsvService.getInstance().getAllMembers();
  },
);

export const updateMember = createAsyncThunk(
  "members/updateMember",
  async ({ id, member }: { id: string; member: Partial<Member> }) => {
    const success = await CsvService.getInstance().updateMember(id, member);
    if (!success) {
      throw new Error("Failed to update member");
    }
    return CsvService.getInstance().getAllMembers();
  },
);

export const deleteMember = createAsyncThunk(
  "members/deleteMember",
  async (id: string) => {
    const success = await CsvService.getInstance().deleteMember(id);
    if (!success) {
      throw new Error("Failed to delete member");
    }
    return CsvService.getInstance().getAllMembers();
  },
);

export const searchMembers = createAsyncThunk(
  "members/searchMembers",
  async (query: string) => {
    return CsvService.getInstance().searchMembers(query);
  },
);

export const filterMembers = createAsyncThunk(
  "members/filterMembers",
  async (filters: {
    gender?: string;
    status?: string;
    financialSupport?: string;
    membershipType?: string;
    ageMin?: number;
    ageMax?: number;
  }) => {
    return CsvService.getInstance().filterMembers(filters);
  },
);

export const getMemberStats = createAsyncThunk(
  "members/getMemberStats",
  async () => {
    return CsvService.getInstance().getMemberStats();
  },
);

export const importMembers = createAsyncThunk(
  "members/importMembers",
  async (members: Member[]) => {
    const result = await CsvService.getInstance().importFromExcel(members);
    if (result.errors.length > 0) {
      throw new Error(`Import completed with ${result.errors.length} errors`);
    }
    return CsvService.getInstance().getAllMembers();
  },
);

interface MembersState {
  list: Member[];
  filteredList: Member[];
  stats: MemberStats | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: string;
  filters: {
    gender: string;
    status: string;
    financialSupport: string;
    membershipType: string;
    ageMin?: number;
    ageMax?: number;
  };
}

const initialState: MembersState = {
  list: [],
  filteredList: [],
  stats: null,
  status: "idle",
  error: null,
  searchQuery: "",
  filters: {
    gender: "all",
    status: "all",
    financialSupport: "all",
    membershipType: "all",
  },
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<typeof initialState.filters>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        gender: "all",
        status: "all",
        financialSupport: "all",
        membershipType: "all",
      };
      state.searchQuery = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreMembers: (state, action: PayloadAction<Member[]>) => {
      state.list = action.payload;
      state.filteredList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Members
      .addCase(getMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.filteredList = action.payload;
        state.error = null;
      })
      .addCase(getMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load members";
      })

      // Add Member
      .addCase(addMember.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.filteredList = action.payload;
        state.error = null;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to add member";
      })

      // Update Member
      .addCase(updateMember.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.filteredList = action.payload;
        state.error = null;
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to update member";
      })

      // Delete Member
      .addCase(deleteMember.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.filteredList = action.payload;
        state.error = null;
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to delete member";
      })

      // Search Members
      .addCase(searchMembers.fulfilled, (state, action) => {
        state.filteredList = action.payload;
      })

      // Filter Members
      .addCase(filterMembers.fulfilled, (state, action) => {
        state.filteredList = action.payload;
      })

      // Get Member Stats
      .addCase(getMemberStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Import Members
      .addCase(importMembers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(importMembers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.filteredList = action.payload;
        state.error = null;
      })
      .addCase(importMembers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to import members";
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  clearError,
  restoreMembers,
} = membersSlice.actions;
export default membersSlice.reducer;
