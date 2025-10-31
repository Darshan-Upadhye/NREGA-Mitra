import mongoose from "mongoose"; 

const nregaDataSchema = new mongoose.Schema({
  fin_year: String,
  month: String,
  state_code: String,
  state_name: String,
  district_code: String,
  district_name: String,
  Approved_Labour_Budget: String,
  Average_Wage_rate_per_day_per_person: String,
  Average_days_of_employment_provided_per_Household: String,
  Differently_abled_persons_worked: String,
  Material_and_skilled_Wages: String,
  Number_of_Completed_Works: String,
  Number_of_GPs_with_NIL_exp: String,
  Number_of_Ongoing_Works: String,
  Persondays_of_Central_Liability_so_far: String,
  SC_persondays: String,
  SC_workers_against_active_workers: String,
  ST_persondays: String,
  ST_workers_against_active_workers: String,
  Total_Adm_Expenditure: String,
  Total_Exp: String,
  Total_Households_Worked: String,
  Total_Individuals_Worked: String,
  Total_No_of_Active_Job_Cards: String,
  Total_No_of_Active_Workers: String,
  Total_No_of_HHs_completed_100_Days_of_Wage_Employment: String,
  Total_No_of_JobCards_issued: String,
  Total_No_of_Workers: String,
  Total_No_of_Works_Takenup: String,
  Wages: String,
  Women_Persondays: String,
  percent_of_Category_B_Works: String,
  percent_of_Expenditure_on_Agriculture_Allied_Works: String,
  percent_of_NRM_Expenditure: String,
  percentage_payments_gererated_within_15_days: String,
  Remarks: String
});

const NregaData = mongoose.model("NregaData", nregaDataSchema);

export default NregaData;