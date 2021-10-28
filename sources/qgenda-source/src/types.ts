export interface LoginV2 {
  error?: string;
  error_description?: string;
  access_token?: string;
  token_type?: string;
  expires_in?: string;
}

export interface Schedule {
  Date: Date;
  StaffAbbrev: string;
  TaskAbbrev: string;
  ScheduleKey?: string;
  CallRole?: null;
  CompKey?: string;
  Credit?: number;
  StartDateUTC?: Date;
  EndDateUTC?: Date;
  EndDate?: Date;
  EndTime?: string;
  IsCred?: boolean;
  IsPublished?: boolean;
  IsLocked?: boolean;
  IsStruck?: boolean;
  Notes?: string;
  IsNotePrivate?: boolean;
  StaffBillSysId?: null;
  StaffEmail?: string;
  StaffEmrId?: null;
  StaffErpId?: string;
  StaffInternalId?: string;
  StaffExtCallSysId?: null;
  StaffFName?: string;
  StaffId?: string;
  StaffKey?: string;
  StaffLName?: string;
  StaffMobilePhone?: string;
  StaffNpi?: string;
  StaffPager?: string;
  StaffPayrollId?: null;
  StaffTags?: null;
  StartDate?: Date;
  StartTime?: string;
  TaskBillSysId?: null;
  TaskContactInformation?: null;
  TaskExtCallSysId?: null;
  TaskId?: string;
  TaskKey?: string;
  TaskName?: string;
  TaskPayrollId?: null;
  TaskEmrId?: null;
  TaskCallPriority?: string;
  TaskDepartmentId?: string;
  TaskIsPrintEnd?: boolean;
  TaskIsPrintStart?: boolean;
  TaskShiftKey?: string;
  TaskType?: string;
  TaskTags?: null;
  LocationName?: string;
  LocationAbbrev?: string;
  LocationID?: string;
  LocationAddress?: string;
  TimeZone?: string;
  LastModifiedDateUTC?: Date;
  LocationTags?: LocationTag[] | null;
  IsRotationTask?: boolean;
  TaskContactInstructions?: null;
}

export interface LocationTag {
  CategoryKey: number;
  CategoryName: string;
  Tags: Tag[];
}

export interface Tag {
  Key: number;
  Name: string;
}

export interface OpenShifts {
  CompanyKey?: string;
  ScheduleKey?: string;
  OpenShiftCount: number;
  CallRole?: null;
  Credit?: number;
  Date: Date;
  StartDateUTC?: Date;
  EndDateUTC?: Date;
  EndDate?: Date;
  EndTime?: string;
  IsCred?: boolean;
  IsSaved?: boolean;
  IsPublished?: boolean;
  IsLocked?: boolean;
  IsStruck?: boolean;
  Notes?: string;
  IsNotePrivate?: boolean;
  StartDate?: Date;
  StartTime?: string;
  TaskAbbrev: string;
  TaskBillSysId?: null;
  TaskContactInstructions?: null;
  TaskId?: string;
  TaskKey?: string;
  TaskName?: string;
  TaskPayrollId?: null;
  TaskEmrId?: null;
  TaskIsPrintEnd?: boolean;
  TaskIsPrintStart?: boolean;
  TaskShiftKey?: string;
  TaskType?: string;
  TaskTags?: null;
  LocationKey?: number;
  LocationName?: string;
  LocationAbbrev?: string;
  LocationAddress?: string;
  TimeZone?: string;
  LocationTags?: LocationTag[];
}

export interface Rotations {
  StartDate: Date;
  EndDate: Date;
  IsPublished: boolean;
  IsLocked: boolean;
  StaffKey: string;
  TaskKey: string;
  Timezone: string;
}

export interface RequestLimitClass {
  CompanyKey: string;
  Name: string;
  Key: string;
  StartDate: Date;
  EndDate: Date;
  Type: string;
  RecurringLength: number;
  CreditSource: string;
  ErrorMessage: string;
  IsActive: boolean;
  DailyTotalMaxAllowedMon: number;
  DailyTotalMaxAllowedTue: number;
  DailyTotalMaxAllowedWed: number;
  DailyTotalMaxAllowedThu: number;
  DailyTotalMaxAllowedFri: number;
  DailyTotalMaxAllowedSat: number;
  DailyTotalMaxAllowedSun: number;
  ShiftCredits: any[];
  StaffLimits: any[];
}

/**
 * RequestLimit/TaskShift
 *
 * PUT https://api.qgenda.com/v2/requestlimit/:requestLimitKey/taskshift/:taskShiftKey
 *
 * Manage the credit associated to task shifts in request limits.
 *
 * Response Object: [RequestLimit](#0850673a-a594-45f1-8e8a-310e6cb93bab)
 */
export interface RequestLimitTaskShift {
  CompanyKey: string;
  Name: string;
  Key: string;
  StartDate: Date;
  EndDate: Date;
  Type: string;
  RecurringLength: number;
  CreditSource: string;
  ErrorMessage: string;
  IsActive: boolean;
  DailyTotalMaxAllowedMon: number;
  DailyTotalMaxAllowedTue: number;
  DailyTotalMaxAllowedWed: number;
  DailyTotalMaxAllowedThu: number;
  DailyTotalMaxAllowedFri: number;
  DailyTotalMaxAllowedSat: number;
  DailyTotalMaxAllowedSun: number;
  ShiftCredits?: ShiftCredit[];
  StaffLimits: any[];
  ShiftsCredit?: ShiftCredit[];
}

export interface ShiftCredit {
  TaskId: string;
  TaskKey: string;
  TaskName: string;
  TaskAbbreviation: string;
  TaskShiftKey: string;
  IsIncluded: boolean;
  DayOfTheWeek: string;
  Credit: number;
}

/**
 * RequestLimit/StaffQuota
 *
 * PUT https://api.qgenda.com/v2/requestlimit/:requestLimitKey/staffquota/:staffid
 *
 * Updates a staff quota for a request limit
 *
 * Response Object: [RequestLimit](#0850673a-a594-45f1-8e8a-310e6cb93bab)
 */
export interface RequestLimitStaffQuota {
  CompanyKey: string;
  Name: string;
  Key: string;
  StartDate: Date;
  EndDate: Date;
  Type: string;
  RecurringLength: number;
  CreditSource: string;
  ErrorMessage: string;
  IsActive: boolean;
  DailyTotalMaxAllowedMon: number;
  DailyTotalMaxAllowedTue: number;
  DailyTotalMaxAllowedWed: number;
  DailyTotalMaxAllowedThu: number;
  DailyTotalMaxAllowedFri: number;
  DailyTotalMaxAllowedSat: number;
  DailyTotalMaxAllowedSun: number;
  ShiftsCredit: any[];
  StaffLimits: StaffLimit[];
}

export interface StaffLimit {
  StaffId: string;
  StaffInternalId: string;
  StaffKey: string;
  StaffFirstName: string;
  StaffLastName: string;
  StaffAbbreviation: string;
  StaffRequestLimit: number;
  StaffTotalLimit: number;
}

export interface TaskLocationElement {
  Task: PurpleTask;
  Location: StaffMemberLocationLocation;
  IsCredentialed: boolean;
}

export interface StaffMemberLocationLocation {
  CompanyKey: string;
  LocationKey: number;
  Id: string;
  Name: string;
  Address: null;
  Abbrev: string;
  Notes: null;
  TimeZone: null;
  Tags: null;
}

export interface PurpleTask {
  TaskKey: string;
  TaskId: string;
  TaskName: string;
  TaskAbbreviation: string;
  Tags: null;
}

export interface PurpleTaskLocation {
  Location: LocationTaskLocation;
  Task: LocationTaskTask;
}

export interface LocationTaskLocation {
  Name: Name;
}

export enum Name {
  Location1 = 'Location 1',
}

export interface LocationTaskTask {
  TaskName: string;
}

/**
 * Task/TaskShift
 *
 * PUT https://api.qgenda.com/v2/task/:taskId/taskshift/:taskShiftKey?dateFormat=String
 *
 * Updates an existing effective dated task shift
 *
 * Response Object: [TaskShift](#fc282b64-7eb3-499b-a031-51daa474a14d)
 */
export interface TaskTaskShift {
  TaskShiftKey: string;
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
  MaxStaff: null;
  MinStaff: number;
  OffAfter: null;
  StatCredit: number;
  StaffCount: number;
  EffectiveDate: EffectiveDate[];
}

export interface EffectiveDate {
  EffectiveFromDate: Date;
  EffectiveToDate: Date;
  StartTime: string;
  EndTime: string;
  MaxStaff: null;
  MinStaff: number;
  OffAfter: null;
  StatCredit: number;
  Occurrence: string;
  IsActive: boolean;
}

export interface DailyPatientEncounter {
  CompanyKey: string;
  DailyConfigurationKey: string;
  EncounterKey: string;
  DailyCaseId: number;
  Date: Date;
  StartTime: Date;
  EndTime: Date;
  IsCancelled: boolean;
  Room: Room;
  Assignments: Assignment[];
  StandardFields: Field[];
  PatientInformation: PatientInformation;
  CreatedBySource: string;
  ModifiedBySource: string;
}

export interface Assignment {
  EncounterRoleKey: string;
  EncounterAssignmentKey: null;
  StaffMemberKey: string;
  StaffMemberAbbreviation: string;
  StaffMemberFirstName: string;
  StaffMemberLastName: string;
  RoleName: string;
  StaffMemberId: string;
  IsNonStaff: boolean;
  IsPublished: boolean;
  IsDefaultRoomAssignment: boolean;
}

export interface PatientInformation {
  PatientFirstName: string;
  PatientLastName: string;
  PatientDateOfBirth: string;
  PatientClinicalNotes: string;
  PatientCity: string;
  PatientState: string;
  PatientAge: string;
}

export interface Room {
  RoomKey: string;
  RoomName: string;
  LocationName: Name;
  LocationKey: number;
}

export interface Field {
  Value?: string;
  EncounterFieldKey: string;
  Name: string;
  Type: string;
  IsRequired: boolean;
}

export interface DailyDailyConfiguration {
  DailyConfigurationKey: string;
  Name: string;
  EncounterRoles: any[];
  EncounterFields: Field[];
  EncounterPhiFields: any[];
}

export interface DailyDailyConfigurationDailyConfigurationKey {
  DailyConfigurationKey: string;
  Name: string;
  EncounterRoles: any[];
  EncounterFields: Field[];
  EncounterPhiFields: any[];
}

export interface PurpleDailyCase {
  DailyCase: FluffyDailyCase;
  Errors: any[];
}

export interface FluffyDailyCase {
  CompanyKey: string;
  EmrId: string;
  TaskKey: string;
  Task: DailyCaseTask;
  LocationName: string;
  Date: Date;
  StartTime: Date;
  EndTime: Date;
  Surgeon: string;
  Procedure: string;
  SupStaffKey: PStaffKey[];
  SupStaffNpi: string[];
  SupStaff: StaffMemberElement[];
  DPStaffKey: PStaffKey[];
  DPStaffNpi: string[];
  DPStaff: StaffMemberElement[];
  CustomTextFields: CustomTextField[];
  CustomCheckboxFields: null;
  IsCancelled: boolean;
  Duration: number;
  BaseUnits: number;
  ModifierUnits: number;
  TimeUnits: number;
  PatientFirstName: string;
  PatientLastName: string;
  PatientAge: string;
  PatientGender: string;
  PatientEmail: null;
  PatientHomePhone: null;
  PatientCellPhone: null;
  PatientAlternatePhone: null;
  PatientGuardianPhone: null;
  PatientGuardianName: null;
  PatientDOB: string;
  PatientMRN: null;
  PatientClinicalNotes: null;
  PatientExtraNotes: null;
  PatientAddress1: null;
  PatientAddress2: null;
  PatientCity: null;
  PatientState: null;
  PatientPostalCode: null;
  PatientPrimaryInsuranceID: null;
  PatientSecondaryInsuranceID: null;
  PatientSocialSecurityNumber: null;
  PatientMaritalStatus: null;
  DailyCaseID: number;
}

export interface CustomTextField {
  ID: string;
  Label: string;
  Value: string;
}

export interface StaffMemberElement {
  Abbreviation: string;
  FirstName: string;
  LastName: string;
  Order: number;
  StaffID: string;
  StaffMemberKey: string;
  IsPublished: boolean;
}

export interface PStaffKey {
  StaffMemberKey: string;
  IsPublished: boolean;
}

export interface DailyCaseTask {
  TaskKey: string;
  IsActive: boolean;
  Abbreviation: string;
  Name: string;
  TaskId: null | string;
  DepartmentID: null;
}

export interface TimeEvent {
  ActualClockIn: Date;
  ActualClockOut: Date;
  CompanyKey: string;
  Date: Date;
  DayOfWeek: number;
  Duration: number;
  EffectiveClockIn: Date;
  EffectiveClockOut: Date;
  IsClockInGeoVerified: boolean;
  IsClockOutGeoVerified: boolean;
  IsEarly: boolean;
  IsLate: boolean;
  IsExcessiveDuration: boolean;
  IsExtended: boolean;
  IsStruck: boolean;
  IsUnplanned: boolean;
  FlagsResolved: boolean;
  Notes: null | string;
  ScheduleEntry: ScheduleEntry | null;
  ScheduleEntryKey: null | string;
  StaffKey: string;
  StaffMember: StaffMemberElement;
  Task: DailyCaseTask;
  TaskKey: string;
  TaskShiftKey: string;
  TimePunchEventKey: number;
  TimeZone: string;
  ActualClockInLocal: Date;
  ActualClockOutLocal: Date;
  EffectiveClockInLocal: Date;
  EffectiveClockOutLocal: Date;
  LastModifiedDate: Date;
}

export interface ScheduleEntry {
  CompKey: string;
  Credit: number;
  Date: Date;
  EndDate: Date;
  EndTime: Date;
  IsCredit: boolean;
  IsLocked: boolean;
  IsPublished: boolean;
  IsSaved: boolean;
  IsStruck: boolean;
  Note: string;
  ScheduleKey: string;
  StaffMemberKey: string;
  StartDate: Date;
  StartTime: Date;
  TaskKey: string;
  TaskShiftKey: string;
}

/**
 * StaffMember/StaffId
 *
 * PUT https://api.qgenda.com/v2/staffmember/:staffId?dateFormat=String
 *
 * Updates a staff member. Any fields not included will not be changed. Any fields included
 * will be changed.
 *
 * Response Object: [StaffMemberDetail](#30f043bf-d75c-49a2-9128-50d69cae794b)
 */
export interface StaffMemberStaffID {
  Abbrev: string;
  BgColor: string;
  BillSysId: null | string;
  CompKey: string;
  Email: string;
  SsoId: null;
  EmrId: null | string;
  ErpId?: string;
  EndDate: Date;
  ExtCallSysId: null | string;
  FirstName: string;
  HomePhone: string;
  LastName: string;
  MobilePhone: string;
  Npi: string;
  Pager: string;
  PayPeriodGroupName: string;
  PayrollId: null | string;
  RegHours: number | null;
  StaffId: string;
  StaffKey: string;
  StartDate: Date;
  TextColor: string;
  Addr1: string;
  Addr2: string;
  City: string;
  State: string;
  Zip: string;
  IsActive: boolean;
  StaffTypeKey: string;
  BillingTypeKey: string;
  UserProfileKey: string;
  UserProfile: string;
  PayrollStartDate: null;
  PayrollEndDate: null;
  TimeClockStartDate: null;
  TimeClockEndDate: null;
  TimeClockKioskPIN: null;
  IsAutoApproveSwap: boolean;
  DailyUnitAverage: number;
  StaffInternalId: string;
  UserLastLoginDateTimeUtc: Date | null;
  SourceOfLogin: string;
  CalSyncKey: null | string;
  Tags: any[] | null;
  TTCMTags?: null;
  Skillset: null;
  Profiles?: null;
  ContactInstructions?: null;
  OtherNumber1?: null;
  OtherNumber2?: null;
  OtherNumber3?: null;
  OtherNumberType1?: null;
  OtherNumberType2?: null;
  OtherNumberType3?: null;
}

/**
 * StaffMember
 *
 * PUT https://api.qgenda.com/v2/staffmember?dateFormat=String
 *
 * Updates a staff member. Any fields not included will not be changed. Any fields included
 * will be changed.
 * Can use NPI, StaffId, BillSysId, and/or Email to match to a staff member. That order
 * respectively will be used for preference when multiple of those properties are provided.
 *
 * Response Object: [StaffMemberDetail](#30f043bf-d75c-49a2-9128-50d69cae794b)
 */
export interface StaffMember {
  Abbrev: string;
  BgColor: string;
  BillSysId: null;
  CompKey: string;
  ContactInstructions: null;
  Email: string;
  SsoId: null | string;
  EmrId: null;
  ErpId?: null;
  EndDate: Date;
  ExtCallSysId: null;
  FirstName: string;
  HomePhone: string;
  LastName: string;
  MobilePhone: string;
  Npi: string;
  OtherNumber1: null;
  OtherNumber2: null;
  OtherNumber3: null;
  OtherNumberType1: null;
  OtherNumberType2: null;
  OtherNumberType3: null;
  Pager: string;
  PayPeriodGroupName: string;
  PayrollId: null;
  RegHours: null;
  StaffId: string;
  StaffKey: string;
  StartDate: Date;
  TextColor: string;
  Addr1: string;
  Addr2: string;
  City: string;
  State: string;
  Zip: string;
  IsActive: boolean;
  StaffTypeKey: string;
  BillingTypeKey: string;
  UserProfileKey: string;
  UserProfile: string;
  PayrollStartDate: null;
  PayrollEndDate: null;
  TimeClockStartDate: null;
  TimeClockEndDate: null;
  TimeClockKioskPIN: null;
  IsAutoApproveSwap: boolean;
  DailyUnitAverage: number;
  StaffInternalId: string;
  UserLastLoginDateTimeUtc: null;
  SourceOfLogin: string;
  CalSyncKey: null;
  Tags: any[];
  Skillset: null;
}

export interface StaffMemberLocation {
  Staff: Staff;
  Location: StaffMemberLocationLocation;
  IsCredentialed: boolean;
  InactiveDate: Date;
  Credentials: any[];
  Tags: null;
}

export interface Staff {
  StaffKey: string;
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Tags: null;
}

/**
 * StaffMember/SkillSet
 *
 * PUT https://api.qgenda.com/v2/staffmember/:staffId/skillset/:taskId
 *
 * Updates a staff's ability to work a task
 *
 * Response Object: [SkillSet](#4484d4f1-3a53-4630-8398-a627eb740a34)
 */
export interface StaffMemberSkillSet {
  StaffFirstName: string;
  StaffLastName: string;
  StaffAbbrev: string;
  StaffId: string;
  TaskName: string;
  TaskAbbrev: string;
  TaskId: string;
  IsSkilledMon: boolean;
  MonOccurrence: string;
  IsSkilledTue: boolean;
  TueOccurrence: string;
  IsSkilledWed: boolean;
  WedOccurrence: string;
  IsSkilledThu: boolean;
  ThuOccurrence: string;
  IsSkilledFri: boolean;
  FriOccurrence: string;
  IsSkilledSat: boolean;
  SatOccurrence: string;
  IsSkilledSun: boolean;
  SunOccurrence: string;
}

export interface Organization {
  CompanyName: string;
  CompanyAbbr: null | string;
  CompanyKey: string;
  DateCreatedUtc: Date | null;
}

export interface Location {
  CompanyKey?: string;
  LocationKey?: number;
  Id: string;
  Name: string;
  Address?: null;
  Abbrev?: string;
  Notes?: null;
  TimeZone?: string;
  Tags?: null;
}

export interface LocationTasks {
  Location: LocationTaskLocation;
  Task: LocationTaskTask;
}

export interface Company {
  CompanyKey: string;
  CompanyName: string;
  CompanyAbbreviation: null;
  CompanyLocation: string;
  CompanyPhoneNumber: string;
}
