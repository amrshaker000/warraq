import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  Eye,
  FileSpreadsheet,
  Filter,
  Grid,
  List,
  Plus,
  Search,
  Square,
  Trash2,
  Upload,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import AnimatedButton from "../components/animations/AnimatedButton";
import AnimatedGroup from "../components/animations/AnimatedGroup";
import {
  getMembers,
  deleteMember,
  restoreMembers,
} from "../slices/membersSlice";
import type { Member, MemberFilters } from "../types/member";
import { useToastContext } from "../hooks/useToastContext";
import { ExcelService } from "../services/excelService";
import { useTheme } from "../hooks/useTheme";
import blackLogo from "/black logo.png";
import whiteLogo from "/white logo.png";
import colourfulLogo from "/colourfull logo.png";

const MembersTable: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: members } = useSelector((state: RootState) => state.members);

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addToast } = useToastContext();
  const { theme } = useTheme();

  // Enhanced member management state
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(),
  );
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filtering and pagination state
  const [filters, setFilters] = useState<MemberFilters>({
    search: "",
    gender: "all",
    status: "all",
    financialSupport: "all",
    membershipType: "all",
    partyUnit: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Modal state
  const [isExporting, setIsExporting] = useState(false);

  // Undo/Redo state management
  const [history, setHistory] = useState<Member[][]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Advanced search functionality
  const [isSearching, setIsSearching] = useState(false);

  // Load members on component mount and check CSV file status
  useEffect(() => {
    const initializeMembers = async () => {
      try {
        dispatch(getMembers());
      } catch (error) {
        console.error("Error initializing members:", error);
      }
    };

    initializeMembers();
  }, [dispatch]);

  // Initialize history when members are loaded
  useEffect(() => {
    if (members.length > 0 && history.length === 0) {
      setHistory([JSON.parse(JSON.stringify(members))]);
      setCurrentHistoryIndex(0);
    }
  }, [members, history.length]);

  // Undo/Redo functions
  const saveToHistory = (newMembers: Member[]) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newMembers)));
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const previousIndex = currentHistoryIndex - 1;
      const previousMembers = history[previousIndex];
      setCurrentHistoryIndex(previousIndex);

      // Restore the previous state to Redux store
      dispatch(restoreMembers(previousMembers));

      addToast({
        title: t("common.success"),
        message: "تم التراجع عن آخر تعديل",
        type: "success",
      });
    } else {
      addToast({
        title: t("common.warning"),
        message: "لا يوجد تعديلات للتراجع عنها",
        type: "warning",
      });
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      const nextMembers = history[nextIndex];
      setCurrentHistoryIndex(nextIndex);

      // Restore the next state to Redux store
      dispatch(restoreMembers(nextMembers));

      addToast({
        title: t("common.success"),
        message: "تم إعادة آخر تعديل",
        type: "success",
      });
    } else {
      addToast({
        title: t("common.warning"),
        message: "لا يوجد تعديلات للإعادة",
        type: "warning",
      });
    }
  };

  // Advanced search function with multiple field support
  const performAdvancedSearch = useCallback(
    (query: string, members: Member[]): Member[] => {
      if (!query.trim()) return members;

      const searchTerm = query.toLowerCase().trim();
      const searchTerms = searchTerm
        .split(" ")
        .filter((term) => term.length > 0);

      return members.filter((member: Member) => {
        const searchableFields = [
          member.fullName,
          member.nationalId,
          member.email,
          member.phoneNumber,
          member.membershipNumber,
          member.address,
          member.job,
          member.partyUnit,
          member.status,
          member.membershipType,
          member.financialSupport,
          member.age.toString(),
        ];

        // Check if all search terms are found in any of the fields
        return searchTerms.every((term) =>
          searchableFields.some((field) => field?.toLowerCase().includes(term)),
        );
      });
    },
    [],
  );

  // Enhanced filter function with advanced search
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Apply search first
    if (filters.search?.trim()) {
      filtered = performAdvancedSearch(filters.search, filtered);
    }

    // Apply other filters
    filtered = filtered.filter((member: Member) => {
      const matchesGender =
        filters.gender === "all" || member.gender === filters.gender;
      const matchesStatus =
        filters.status === "all" || member.status === filters.status;
      const matchesFinancialSupport =
        filters.financialSupport === "all" ||
        member.financialSupport === filters.financialSupport;
      const matchesMembershipType =
        filters.membershipType === "all" ||
        member.membershipType === filters.membershipType;
      const matchesPartyUnit =
        filters.partyUnit === "all" ||
        (member.partyUnit || "") === filters.partyUnit;

      return (
        matchesGender &&
        matchesStatus &&
        matchesFinancialSupport &&
        matchesMembershipType &&
        matchesPartyUnit
      );
    });

    return filtered;
  }, [members, filters, performAdvancedSearch]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  // Statistics for header
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m: Member) => m.status === "active").length;
    const paid = members.filter(
      (m: Member) => m.financialSupport === "paid",
    ).length;
    const males = members.filter((m: Member) => m.gender === "male").length;

    return { total, active, paid, males };
  }, [members]);

  // Event handlers
  const handleFilterChange = useCallback(
    (key: keyof MemberFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1);
    },
    [],
  );

  const handleSelectMember = (memberId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedMembers);
    if (isSelected) {
      newSelection.add(memberId);
    } else {
      newSelection.delete(memberId);
    }
    setSelectedMembers(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === paginatedMembers.length) {
      setSelectedMembers(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedMembers(new Set(paginatedMembers.map((m: Member) => m.id)));
      setShowBulkActions(true);
    }
  };

  const handleViewMember = (member: Member) => {
    navigate(`/entry/${member.id}?mode=view`);
  };

  const handleEditMember = (member: Member) => {
    navigate(`/entry/${member.id}`);
  };

  const handleDeleteMember = async (member: Member) => {
    if (
      window.confirm(t("members.deleteConfirmation", { name: member.fullName }))
    ) {
      // Save current state to history before deleting
      saveToHistory(members);

      try {
        await dispatch(deleteMember(member.id)).unwrap();
        addToast({
          title: t("common.success"),
          message: t("members.deleteSuccess", { name: member.fullName }),
          type: "success",
        });
      } catch {
        addToast({
          title: t("common.error"),
          message: t("members.deleteError"),
          type: "error",
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMembers.size === 0) return;

    const confirmMessage = t("members.bulkDeleteConfirm", {
      count: selectedMembers.size,
    });

    if (window.confirm(confirmMessage)) {
      // Save current state to history before bulk deleting
      saveToHistory(members);

      try {
        const deletePromises = Array.from(selectedMembers).map((id) =>
          dispatch(deleteMember(id)).unwrap(),
        );
        await Promise.all(deletePromises);

        addToast({
          title: t("common.success"),
          message: t("members.bulkDeleteSuccess", {
            count: selectedMembers.size,
          }),
          type: "success",
        });

        setSelectedMembers(new Set());
        setShowBulkActions(false);
      } catch {
        addToast({
          title: t("common.error"),
          message: t("members.bulkDeleteError"),
          type: "error",
        });
      }
    }
  };

  const handleBulkExport = async () => {
    if (selectedMembers.size === 0) return;

    setIsExporting(true);
    try {
      const selectedMembersData = members.filter((m: Member) =>
        selectedMembers.has(m.id),
      );
      await ExcelService.exportToExcel(selectedMembersData);

      addToast({
        title: t("common.success"),
        message: t("members.exportSuccess", {
          count: selectedMembersData.length,
        }),
        type: "success",
      });
    } catch {
      addToast({
        title: t("common.error"),
        message: t("members.exportError"),
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await ExcelService.exportToExcel(members);
      addToast({
        title: t("common.success"),
        message: t("members.exportSuccess", { count: members.length }),
        type: "success",
      });
    } catch (error) {
      console.error("Export failed:", error);
      addToast({
        title: t("common.error"),
        message: t("members.exportError", {
          error: error instanceof Error ? error.message : String(error),
        }),
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Filter options
  const genderOptions = [
    { value: "all", label: t("common.all") },
    { value: "male", label: t("common.male") },
    { value: "female", label: t("common.female") },
  ];

  const statusOptions = [
    { value: "all", label: t("common.all") },
    { value: "active", label: t("common.active") },
    { value: "inactive", label: t("common.inactive") },
    { value: "suspended", label: t("common.suspended") },
  ];

  const financialSupportOptions = [
    { value: "all", label: t("common.all") },
    { value: "paid", label: t("members.paid") },
    { value: "unpaid", label: t("members.unpaid") },
  ];

  const partyUnitOptions = [
    { value: "all", label: t("common.all") },
    { value: "وراق الحضر", label: "وراق الحضر" },
    { value: "وراق العرب", label: "وراق العرب" },
    { value: "جزيرة محمد", label: "جزيرة محمد" },
    { value: "طناش", label: "طناش" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-2 sm:p-4 lg:p-8 rtl">
          <>
            {/* Enhanced Header with Statistics */}
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
              <AnimatedGroup staggerDelay={0.2} direction="up" distance={15}>
                <div className="text-center lg:text-left">
                  <div className="flex items-center mb-4">
                    <img
                      src={theme === "dark" ? whiteLogo : blackLogo}
                      alt="logo"
                      className="h-32 w-32 lg:h-40 lg:w-40 object-contain mr-4"
                    />
                    <div className="flex-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white font-arabic">
                        {t("members.title")}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 font-arabic">
                        {t("members.searchAndFilter")}
                      </p>

                      {/* Quick Statistics */}
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            {t("members.totalCount", { count: stats.total })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                          <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            {t("members.activeCount", { count: stats.active })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-lg">
                          <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                            {t("members.paidCount", { count: stats.paid })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 lg:space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleUndo}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                    className="w-full sm:w-auto"
                    disabled={currentHistoryIndex <= 0}
                  >
                    {t("common.undo")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRedo}
                    leftIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full sm:w-auto"
                    disabled={currentHistoryIndex >= history.length - 1}
                  >
                    {t("common.redo")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportExcel}
                    isLoading={isExporting}
                    leftIcon={<FileSpreadsheet className="h-5 w-5" />}
                    className="w-full sm:w-auto"
                  >
                    <span className="hidden sm:inline">
                      {t("export.excel")}{" "}
                    </span>
                    <span className="sm:hidden">{t("export.excel")}</span>
                  </Button>
                  <AnimatedButton
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => navigate("/entry")}
                    delay={0.1}
                    className="w-full sm:w-auto"
                  >
                    {t("navigation.addMember")}
                  </AnimatedButton>
                </div>
              </AnimatedGroup>
            </div>

            {/* Enhanced Filters */}
            <Card className="p-4 lg:p-6 mb-6">
              <AnimatedGroup staggerDelay={0.1} direction="up" distance={15}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t("members.filters")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Filter className="h-4 w-4" />}
                    onClick={() =>
                      setFilters({
                        search: "",
                        gender: "all",
                        status: "all",
                        financialSupport: "all",
                        membershipType: "all",
                        partyUnit: "all",
                      })
                    }
                  >
                    {t("members.clearFilters")}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4">
                  <div className="relative">
                    <Input
                      placeholder={t("common.search")}
                      value={filters.search}
                      onChange={(e) => {
                        handleFilterChange("search", e.target.value);
                        setIsSearching(e.target.value.length > 0);
                      }}
                      leftIcon={<Search className="h-4 w-4" />}
                      rightIcon={
                        filters.search ? (
                          <button
                            onClick={() => {
                              handleFilterChange("search", "");
                              setIsSearching(false);
                            }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="مسح البحث"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : null
                      }
                      fullWidth
                      className={`w-full transition-all duration-200 ${
                        isSearching
                          ? "ring-2 ring-primary-500 border-primary-500"
                          : ""
                      }`}
                    />

                    {/* Search Status Indicator */}
                    {isSearching && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <Select
                    options={genderOptions}
                    value={filters.gender}
                    onChange={(e) =>
                      handleFilterChange("gender", e.target.value)
                    }
                    placeholder={t("members.gender")}
                    fullWidth
                    className="w-full"
                  />
                  <Select
                    options={statusOptions}
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    placeholder={t("members.status")}
                    fullWidth
                    className="w-full"
                  />
                  <Select
                    options={financialSupportOptions}
                    value={filters.financialSupport}
                    onChange={(e) =>
                      handleFilterChange("financialSupport", e.target.value)
                    }
                    placeholder={t("members.financialSupport")}
                    fullWidth
                    className="w-full"
                  />
                  <Select
                    options={partyUnitOptions}
                    value={filters.partyUnit}
                    onChange={(e) =>
                      handleFilterChange("partyUnit", e.target.value)
                    }
                    placeholder={t("members.partyUnit")}
                    fullWidth
                    className="w-full"
                  />
                </div>
              </AnimatedGroup>
            </Card>

            {/* Bulk Actions Bar */}
            {showBulkActions && (
              <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-700 dark:text-blue-300">
                      {t("common.selectedMembers", {
                        count: selectedMembers.size,
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkExport}
                      leftIcon={<Upload className="h-4 w-4" />}
                    >
                      {t("export.excel")}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleBulkDelete}
                      leftIcon={<Trash2 className="h-4 w-4" />}
                    >
                      {t("members.deleteSelected")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMembers(new Set());
                        setShowBulkActions(false);
                      }}
                    >
                      {t("common.cancel")}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Members Display */}
            <Card className="overflow-hidden">
              {paginatedMembers.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="max-w-md mx-auto text-center">
                    <img
                      src={theme === "dark" ? "/Gold logo.png" : colourfulLogo}
                      alt="logo"
                      className="h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48 object-contain mx-auto"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
                      {t("members.emptyState.welcome")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed text-center">
                      {t("members.emptyState.description")}
                    </p>
                    <div className="space-y-3 mb-8 flex flex-col items-center">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>
                          {t("members.emptyState.features.addMembers")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>
                          {t("members.emptyState.features.manageData")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>
                          {t("members.emptyState.features.advancedSearch")}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3">
                      <AnimatedButton
                        variant="primary"
                        size="lg"
                        leftIcon={<Plus className="h-5 w-5" />}
                        onClick={() => navigate("/entry")}
                        className="w-full sm:w-auto"
                      >
                        {t("members.emptyState.cta")}
                      </AnimatedButton>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                      {t("members.emptyState.subtitle")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Table Header for Bulk Selection */}
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAll}
                          leftIcon={
                            selectedMembers.size === paginatedMembers.length &&
                            paginatedMembers.length > 0 ? (
                              <CheckSquare className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )
                          }
                          className="text-sm"
                        >
                          {t("members.table.selectAll")}
                        </Button>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("members.table.showingResults", {
                            current: paginatedMembers.length,
                            total: filteredMembers.length,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {t("common.view")}:
                        </span>
                        <Button
                          variant={viewMode === "cards" ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("cards")}
                          leftIcon={<Grid className="h-4 w-4" />}
                        >
                          {t("members.table.viewCards")}
                        </Button>
                        <Button
                          variant={viewMode === "table" ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("table")}
                          leftIcon={<List className="h-4 w-4" />}
                        >
                          {t("members.table.viewTable")}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Cards View */}
                  {viewMode === "cards" && (
                    <div className="space-y-4 p-4">
                      <AnimatedGroup
                        staggerDelay={0.1}
                        direction="up"
                        distance={15}
                      >
                        {paginatedMembers.map((member: Member) => (
                          <div
                            key={member.id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={selectedMembers.has(member.id)}
                                  onChange={(e) =>
                                    handleSelectMember(
                                      member.id,
                                      e.target.checked,
                                    )
                                  }
                                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                    {member.fullName}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t("members.membershipNumber")}:{" "}
                                    <span className="ltr">
                                      {member.membershipNumber}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-1 sm:space-x-2 rtl:space-x-reverse self-end sm:self-start">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewMember(member)}
                                  className="p-2 flex-shrink-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditMember(member)}
                                  className="p-2 flex-shrink-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMember(member)}
                                  className="p-2 text-red-600 hover:text-red-700 flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                                <div className="min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 block text-xs font-medium">
                                    {t("members.nationalId")}:
                                  </span>
                                  <p className="font-medium text-gray-900 dark:text-white truncate ltr">
                                    {member.nationalId}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 block text-xs font-medium">
                                    {t("members.gender")}:
                                  </span>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {t(`common.${member.gender}`)}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 block text-xs font-medium">
                                    {t("members.phoneNumber")}:
                                  </span>
                                  <p className="font-medium text-gray-900 dark:text-white truncate ltr">
                                    {member.phoneNumber}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 block text-xs font-medium">
                                    {t("members.partyUnit")}:
                                  </span>
                                  <p className="font-medium text-gray-900 dark:text-white truncate">
                                    {member.partyUnit || "-"}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 block text-xs font-medium">
                                    {t("members.age")}:
                                  </span>
                                  <p className="font-medium text-gray-900 dark:text-white ltr">
                                    {member.age}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                                    {t("members.status")}:
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      member.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        : member.status === "inactive"
                                          ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    }`}
                                  >
                                    {t(`common.${member.status}`)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                                    {t("members.membershipType")}:
                                  </span>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    {t(
                                      `members.memberTypes.${member.membershipType}`,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </AnimatedGroup>
                    </div>
                  )}

                  {/* Enhanced Pagination */}
                  <div className="bg-white dark:bg-gray-900 px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 space-y-2 sm:space-y-0">
                    <div className="flex-1 flex justify-between sm:hidden w-full">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="flex items-center text-sm"
                      >
                        <ChevronRight className="h-4 w-4 ml-1" />
                        {t("common.previous")}
                      </Button>
                      <span className="text-sm text-gray-700 dark:text-gray-300 px-2 ltr">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center text-sm"
                      >
                        {t("common.next")}
                        <ChevronLeft className="h-4 w-4 mr-1" />
                      </Button>
                    </div>

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-arabic">
                          {t("members.pagination.showing", {
                            from: (currentPage - 1) * itemsPerPage + 1,
                            to: Math.min(
                              currentPage * itemsPerPage,
                              filteredMembers.length,
                            ),
                            total: filteredMembers.length,
                          })}
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm space-x-reverse space-x-1 rtl:space-x-reverse">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="flex items-center"
                          >
                            <ChevronRight className="h-4 w-4 ml-1" />
                            <span className="mr-2 font-arabic">
                              {t("common.previous")}
                            </span>
                          </Button>

                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let page;
                              if (totalPages <= 5) {
                                page = i + 1;
                              } else if (currentPage <= 3) {
                                page = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                              } else {
                                page = currentPage - 2 + i;
                              }

                              if (
                                (i === 1 && currentPage > 3) ||
                                (i === 3 && currentPage < totalPages - 2)
                              ) {
                                return (
                                  <span
                                    key={i}
                                    className="px-3 py-1 text-sm text-gray-500"
                                  >
                                    ...
                                  </span>
                                );
                              }

                              return (
                                <Button
                                  key={page}
                                  variant={
                                    currentPage === page ? "primary" : "ghost"
                                  }
                                  size="sm"
                                  onClick={() => setCurrentPage(page)}
                                  className="font-arabic min-w-[32px] ltr"
                                >
                                  {page}
                                </Button>
                              );
                            },
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages),
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="flex items-center"
                          >
                            <span className="ml-2 font-arabic">
                              {t("common.next")}
                            </span>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                          </Button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </>
        </main>
      </div>
    </div>
  );
};

export default MembersTable;
